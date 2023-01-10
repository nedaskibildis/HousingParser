// Copyright 2016-2020 Ellucian Company L.P. and its affiliates.
// 
// Message - a generic message UI element 
// Parameters:
// isVisible  (required) - boolean - is the message visible at this time?
// message    (required) - text - the message to be displayed
// title      (optional) - text - the title for the message (displayed in bold)
// button     (optional) - object - an object containing details for a button to render within the message
//                         button: { 'callback': someFunc, 'label': 'someText', 'ariaLabel': 'otherText' }
//                         callback and label are required. ariaLabel will default to label when not provided.
// type       (optional) - text/enum - the purpose of the message
//                         "error", "warning", "success", or "info"
//                         defaults to "info" if not provided
// addMargin  (optional) - boolean - add standard margin around the message
//                         useful when parent container loses padding on mobile
// isSmall    (optional) - render smaller than normal
//                         defaults to false
// isInline   (optional) - render inline, instead of block (full width)
//                         defaults to false
// ariaLive      (optional) - what ARIA should this message have? 
//                         defaults to "polite" (assertive is typically too aggressive as a default)
//
// Usage:
//
// <message params="isVisible: showNow, message: someText, type: 'error', addMargin: isMobile"></message>
//
// Notes:
// The template (markup) for this component can be found in ./_Message.html
//
// When placing messages on a page, be cognizant of the "scope" of the message. Messages that require prompts,
// should fade after a delay, or be removable might be suited for display in the notification center.
//
// Message that need to be "front and center" on the page should appear immediately following the page header, outside
// and sections.
//
// Messages used within the contents of a page (with a section, etc) should relate directly to the other content within 
// that container.
//
define(['text!Message/_Message.html'], function (markup) {
    function MessageViewModel(params) {
        var self = this;

        try {

            self.message = null;
            self.title = null;
            self.type = (typeof (params.type) !== "undefined" ? (ko.isObservable(params.type) ? params.type : ko.observable(params.type)) : ko.observable("info"));
            self.buttonCallback = null;
            self.buttonLabel = null;
            self.buttonAriaLabel = null;
            self.buttonStyle = "";
            self.addMargin = ko.isObservable(params.addMargin) ? params.addMargin : ko.observable(params.addMargin);

            // Initialize the ariaLive parameter
            self.ariaLive = ko.observable("polite");
            if (params.ariaLive !== null && typeof params.ariaLive !== 'undefined') {
                self.ariaLive = ko.isObservable(params.ariaLive) ? params.ariaLive : ko.observable(params.ariaLive);
            }

            if (typeof (params.isVisible) === "undefined") {
                throw "Please provide a valid isVisible value.";
            }

            if (typeof (params.message) === "undefined") {
                throw "Please provide a valid message value.";
            } else {
                self.message = ko.isObservable(params.message) ? params.message : ko.observable(params.message);
            }

            self.index = ko.observable(window.Ellucian.indexCounter.next());

            self.consentAlertMsgId = ko.computed(function () {
                return 'consent-alert-msg-' + self.index();
            });

            self.consentChangedTitleId = ko.computed(function () {
                return 'consent-changed-title-' + self.index();
            });

            self.consentChangedMsgId = ko.computed(function () {
                return 'consent-changed-msg-' + self.index();
            });

            self.isVisible = ko.computed(function () {
                // If the message is empty/null/undefined, hide the message
                var message = ko.unwrap(params.message);
                if (typeof message === 'undefined' || message === null || message.length === 0) {
                    return false;
                } else { // No problem with the message, so use the provided isVisible parameter
                    return ko.unwrap(params.isVisible);
                }
            });

            self.modifier1 = ko.computed(function () {
                var value = "esg-alert esg-alert--fluid";
                switch (self.type().toLowerCase()) {
                    case "error":
                        value = value + " esg-alert--error";
                        break;
                    case "warning":
                        value = value + " esg-alert--warning";
                        break;
                    case "success":
                        value = value + " esg-alert--success";
                        break;
                    case "info": // "info" is also the default, so allow that case to fall through
                    default:
                        value = value + " esg-alert--info";
                        break;
                }
                // If isSmall is defined and set to true, use the small style
                if (typeof (params.isSmall) !== "undefined" && ko.unwrap(params.isSmall) === true) {
                    value = value + " esg-alert--small";
                }

                // If isInline is defined and set to true, use the inline style
                if (typeof (params.isInline) !== "undefined" && ko.unwrap(params.isInline) === true) {
                    value = value + " esg-alert--inline";
                }

                // If addMargin is defined and set to true, add left/right margins
                if (typeof (params.addMargin) !== "undefined" && ko.unwrap(params.addMargin) === true) {
                    value = value + " esg-alert--extra-margin";
                }
                return value;
            });
            self.modifier2 = ko.computed(function () {
                switch (self.type().toLowerCase()) {
                    case "error":
                        return "esg-icon--error-dark";
                    case "warning":
                        return "esg-icon--warning-dark";
                    case "success":
                        return "esg-icon--success-dark";
                    case "info": // "info" is also the default, so allow that case to fall through
                    default:
                        return "esg-icon--info-dark";
                }
            });
            self.iconId = ko.computed(function () {
                switch (self.type().toLowerCase()) {
                    case "error":
                        return "#icon-error";
                    case "warning":
                        return "#icon-warning";
                    case "success":
                        return "#icon-check";
                    case "info": // "info" is also the default, so allow that case to fall through
                    default:
                        return "#icon-info";
                }
            });

            if (typeof (params.title) !== "undefined") {
                self.title = ko.isObservable(params.title) ? params.title : ko.observable(params.title);
            }

            if (typeof (params.button) !== "undefined") {
                var button = params.button;
                if (typeof (button.callback) === "undefined") {
                    throw "Please provide a valid callback for the button.";
                }
                if (typeof (button.label) === "undefined") {
                    throw "Please provide a valid label for the button";
                }
                self.buttonCallback = button.callback;
                self.buttonLabel = ko.isObservable(button.label) ? button.label : ko.observable(button.label);

                if (typeof (button.ariaLabel) !== "undefined") {
                    self.buttonAriaLabel = ko.isObservable(button.ariaLabel) ? button.ariaLabel : ko.observable(button.ariaLabel);
                } else {
                    self.buttonAriaLabel = self.buttonLabel;
                }
                // If isSmall is defined and set to true, use the small style
                self.buttonStyle = "eds-button--secondary float-right";
                if (typeof (params.isSmall) !== "undefined" && ko.unwrap(params.isSmall) === true) {
                    self.buttonStyle = self.buttonStyle + " eds-button--small";
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return { viewModel: MessageViewModel, template: markup };
});