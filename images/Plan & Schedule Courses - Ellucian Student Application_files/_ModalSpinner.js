//Copyright 2016-2017 Ellucian Company L.P. and its affiliates.
// 
// ModalSpinner - a "data loading" modal spinner UI element 
// Parameters:
// isVisible  (required) - boolean - is the message visible at this time?
// message    (optional) - text - the message to be displayed
//                                Default is SpinnerDefaultMessage in SiteResources.resx
//
// Usage:
//
// <modal-spinner params="isVisible: showNow, message: someText"></modal-spinner>
//
// Notes:
// The template (markup) for this component can be found in ./ModalSpinner.html
//
define(['text!ModalSpinner/_ModalSpinner.html'], function (markup) {
    function ModalSpinnerViewModel(params) {
        var self = this;
        try {
            if (typeof params.isVisible === "undefined") {
                throw "Please provide a valid isVisible parameter."
            }

            self.isVisible = ko.isObservable(params.isVisible) ? params.isVisible : ko.observable(params.isVisible);
            if (typeof (params.message) === "undefined") {
                self.message = ko.observable(Ellucian.Site.Resources.SpinnerDefaultMessage);
            } else {
                self.message = ko.isObservable(params.message) ? params.message : ko.observable(params.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return { viewModel: ModalSpinnerViewModel, template: markup };
});