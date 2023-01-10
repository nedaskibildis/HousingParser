//Copyright 2016-2020 Ellucian Company L.P. and its affiliates.
// 
// Spinner - a "page loading" spinner UI element 
// Parameters:
// isVisible  (required) - boolean - is the message visible at this time?
// message    (optional) - text - the message to be displayed
//                       - empty string ('') will result in the message being hidden
//                       - Default (undefined) is SpinnerDefaultMessage in SiteResources.resx
// size       (optional) - string value to indicate the size of the spinner. (supported sizes are "default", "small", and "x-small").
//                       - Undefined or any unsupported value will be treated as the "default" ESG spinner size.
//
// Usage:
//
// <spinner params="isVisible: showNow, message: someText"></spinner>
//
// Notes:
// The template (markup) for this component can be found in ./_Spinner.html
//
define(['text!Spinner/_Spinner.html'], function (markup) {
    function SpinnerViewModel(params) {
        try {
            if (typeof params.isVisible === "undefined") {
                throw "Please provide a valid isVisible parameter."
            }

            var self = this;
            self.isVisible = ko.isObservable(params.isVisible) ? params.isVisible : ko.observable(params.isVisible);

            if (typeof (params.message) === "undefined") {
                self.message = ko.observable(Ellucian.Site.Resources.SpinnerDefaultMessage);
            } else {
                self.message = ko.isObservable(params.message) ? params.message : ko.observable(params.message);
            }

            if (typeof (params.size) === "undefined") {
                self.size = ko.observable("default");
            }
            else {
                self.size = ko.isObservable(params.size) ? params.size : ko.observable(params.size);
            }

            self.sizeClass = ko.pureComputed(function () {
                var size = self.size();
                var sizeClass = "";
                switch (size) {
                    case "x-small":
                        sizeClass = " esg-spinner-container--x-small";
                        break;
                    case "small":
                        sizeClass = " esg-spinner__small";
                        break;
                    default:
                        sizeClass = "";
                        break;
                }
                return sizeClass;
            });

            // Announce content loading to screen readers
            function announceLoading(isVisibleValue) {
                function removeAnnouncement() {
                    setTimeout(function () {
                        $('#aria-announcements').each(function () {
                            $(this).empty();
                        });
                    }, 1000); // delay to remove message from queue (1 second)
                }

                // If spinner is visible, set aria-announcements to loading message, then clear the message
                if (isVisibleValue) {
                    $('#aria-announcements').each(function () {
                        $(this).html('<p>' + self.message() + '</p>');
                        removeAnnouncement();
                    });
                }
                    // If spinner is not visible, set aria-announcments to completed message, then clear the message
                else {
                    $('#aria-announcements').each(function () {
                        $(this).html('<p>' + Ellucian.Site.Resources.SpinnerLoadingCompleteMessage + '</p>');
                        removeAnnouncement();
                    });
                }
            };

            // Initial call on page load if spinner is active
            if (self.isVisible()) {
                announceLoading(self.isVisible());
            }

            // Subscribe to isVisible changes to push screen reader loading announcements
            self.isVisibleSubscription = self.isVisible.subscribe(function (isVisibleValue) {
                announceLoading(isVisibleValue);
            });

            self.showMessage = ko.pureComputed(function () {
                return self.message() && self.message().length > 0;
            });

            self.wrapperClass = ko.pureComputed(function () {
                if (!self.showMessage()) {
                    return "esg-spinner-container esg-spinner-container--no-padding-top" + self.sizeClass();
                }
                else {
                    return "esg-spinner-container" + self.sizeClass();
                }
            });

            self.dispose = function () {
                self.isVisibleSubscription.dispose();
            };
        } catch (error) {
            console.log(error);
        }
    }
    return { viewModel: SpinnerViewModel, template: markup };
});