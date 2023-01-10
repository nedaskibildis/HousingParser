//Copyright 2016-2020 Ellucian Company L.P. and its affiliates.
// 
// ModalDialog - a modal dialog 
// Parameters:
// isVisible (required) - boolean - is the modal visible at this time?
// title     (required) - text - the title of the dialog
// content   (required) - object - the data used to render elements in the dialog 
// buttons   (optional) - array - which buttons to show, with their details
//                        Note: A cancel button will always be rendered on the left of the button bar
//                        { title : 'Do Something', callback : someFunction, isPrimary: [true | false], enabled: [true | false], disabled: [true | false], id: id, visible: true }
//                        NOTE: button disabled and enabled are optional. You should only provide one for any given button.
//                        NOTE: callback function must already be defined when button object is created 
// defaultCloseOff (optional) - turn off the default close buttons (use if you need a close/cancel button that does something
//                              other than simply closing the dialog)
// pureModal (optional) - turn on if you do not want modal dialog  to close if clicked outside modal dialog. Only will close when action taken on modal dialog.
//
// Usage:
//
// <modal-dialog params="isVisible: showNow, title: someText, buttons: [{ title: 'Cancel', callback: cancelFunc, isPrimary: false },{ title: 'Save', callback: saveFunc, isPrimary: true }] "></modal-dialog>
//
// Notes:
// The template (markup) for this component can be found in ./ModalDialog.html
//

define(['text!ModalDialog/_ModalDialog.html'], function (markup) {
    function ModalDialogViewModel(params) {
        var self = this;
        try {
            if (typeof params.isVisible === "undefined") {
                throw "Please provide a valid isVisible parameter."
            }
            if (typeof params.title === "undefined") {
                throw "Please provide a valid title parameter."
            }
            if (typeof params.content === "undefined") {
                throw "Please provide a valid content parameter."
            }

            self.isVisible = params.isVisible;
            self.toggle = function () {
                self.isVisible(!self.isVisible());
            }  

            self.title = params.title;
            self.content = params.content;
            //to determine if dialog box shall close when clicked outside the dialog
            self.pureModal = ko.pureComputed(function () {

                if (typeof params.pureModal !== "undefined" && ko.unwrap(params.pureModal) === true) {
                    return true;
                }
                else
                    return false;
            }).extend({ deferred: true });;
            // Configure the buttons for this modal
            self.defaultCloseOff = params.defaultCloseOff;
            self.closeButtonText = Ellucian.SharedComponents.ButtonLabels.buttonTextClose;
            self.buttons = params.buttons || [];
            // This view model supports rendering a default cancel button, this can be overridden if the cancel button needs to customized or not rendered at all
            if (typeof self.defaultCloseOff === "undefined" || ko.unwrap(self.defaultCloseOff) === false) {

                // Use the "Cancel" label if other buttons are present;
                // otherwise, use the "Close" label.
                var buttonTitle = (self.buttons.length > 0) ? Ellucian.SharedComponents.ButtonLabels.buttonTextCancel : Ellucian.SharedComponents.ButtonLabels.buttonTextClose;

                self.buttons.unshift({ title: buttonTitle, callback: self.toggle, isPrimary: false, disabled: false });
            }
            // Iterate through the button objects provided in params, updating as needed
            self.buttons.forEach(function (button, index, buttons) {
                // Add the correct classes to each button
                button.classes = "esg-button esg-modal-dialog__button";
                if (ko.unwrap(button.isPrimary) === true) {
                    button.classes += " esg-button--primary";
                } else {
                    button.classes += " esg-button--secondary";
                };
                
                // If an enabled or disabled param have been provided, set the state of the button accordingly
                if (typeof button.disabled !== "undefined" && typeof button.enabled !== "undefined") {
                    throw "Please select only one of enabled or disabled";
                } else if (typeof button.disabled === "undefined" && typeof button.enabled === "undefined") {
                    button.disabled = false;
                } else if (typeof button.disabled === "undefined" && typeof button.enabled !== "undefined") {
                    button.disabled = ko.computed(function () { return !ko.unwrap(button.enabled); });
                } else if (typeof button.disabled !== "undefined" && typeof button.enabled === "undefined") {
                    button.enabled = ko.observable(function () { return !ko.unwrap(button.disabled); });
                }

                // If an ID was not provided, explicitly set to null (undefined causes binding errors)
                button.id = typeof button.id === "undefined" ? null : (ko.isObservable(button.id) ? button.id : ko.observable(button.id))

                // If an aria label was not provided, explicitly set to button title (undefined causes binding errors)
                button.aria = typeof button.aria === "undefined" ? (button.title ? button.title : null) : (ko.isObservable(button.aria) ? button.aria : ko.observable(button.aria));                

                // If a visible flag was not provided, default to true
                button.visible = typeof button.visible === "undefined" ? true : (ko.isObservable(button.visible) ? button.visible : ko.observable(button.visible));
            });
        } catch (error) {
            console.log(error);
        }

        self.tabIndex = ko.pureComputed(function () {
            return self.isVisible() ? '-1' : '';
        });

        var restoreFocusElement = null;
        var modalElement = null;
        var previousElement = null;
        var lastElement = null;

        // Keeps the focus in the modal dialog box when navigating
        var focusHandler = function (event) {
            // If the event.target does not exist, determines which element to focus on, otherwise sets the previousElement
            if (!modalElement.contains(event.target) && modalElement !== previousElement) {
                event.stopPropagation();
                modalElement.focus();
            } else if (!modalElement.contains(event.target) && modalElement === previousElement) {
                event.stopPropagation();
                // If the lastElement cannot receive focus, focus needs to be moved to another element
                if (lastElement === null || lastElement.focus() !== true) {
                    // This will typically be a close or cancel button
                    modalElement.querySelector('.esg-button--secondary').focus();
                } else {
                    lastElement.focus();
                }
            } else {
                previousElement = document.activeElement;
            }
        };

        var escapeHandler = function(event) {
            if (event.keyCode == 27) {
                self.isVisible(false);
            }
        };    

        self.isVisible.subscribe(function (value) {
            if (value) {
                // Get clicked element to enable focus restoration on dialog close
                restoreFocusElement = document.activeElement;

                // Add focus handling inside a timeout to ensure the dialog is actually open
                setTimeout(function () {

                    // Hopefully there is only one open dialog at a time.
                    modalElement = $(document).find(".esg-modal-dialog[tabindex='-1']")[0];

                    // Discovers the last tabbable element in the modal dialog
                    lastElement = modalElement.querySelector('.esg-button--primary');

                    // Initializes the previousElement as the first element
                    previousElement = modalElement;

                    // Start by giving focus to the dialog (tabindex just makes it accessible, doesn't actually change focus)
                    $(modalElement).trigger("focus");

                    // Listen for focus changes, if the new focused element is outside the dialog, return focus to the dialog
                    document.addEventListener("focus", focusHandler, true);

                    // Listen for ESC key and close dialog appropriately.
                    document.addEventListener("keydown", escapeHandler, true);
                }, 1);
            } else {
                // Remove the focus handler
                document.removeEventListener("focus", focusHandler, true);

                // Remove the escape handler
                document.removeEventListener("keydown", escapeHandler, true);

                // Restore focus to restoreFocusElement (captured above).  It's inside a timeout to ensure the dialog has closed.
                setTimeout(function () {
                    if (restoreFocusElement != null) {
                        restoreFocusElement.focus();
                        restoreFocusElement = null;
                    }
                    modalElement = null;
                }, 1);
            }
        });


        self.overlayDisplay = ko.pureComputed(function () {
            return self.isVisible() ? 'block' : 'none';
        });
    }

    // In order to avoid a "flicker", some modals have display: none set inline.  Undo this now that the DOM is ready and bindings are occuring.
    $("modal-dialog").removeAttr('style');

    return { viewModel: ModalDialogViewModel, template: markup };
});