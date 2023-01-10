// Copyright 2016-2022 Ellucian Company L.P. and its affiliates.
// 
// Message - a generic message UI element 
// Parameters:
// isVisible   (required) - boolean - is the message visible at this time?
// icon        (required) - text/enum - 'info', 'warning', 'error', etc
//                         See Ellucian style guide for full list of available icons
// title       (optional) - text - a title of the icon; also used for the aria-label (accessibility)
//                         Default (no value) is an empty string
// description (optional) - text - a description of the icon
//                         Default (no value) is an empty string
// color       (optional) - text/enum - 'light', 'neutral', 'info', 'info-dark', 'warning',
//                                     'warning-dark', 'error', 'error-dark', 'success', 'success-dark'
//                         Default (no value) is blue, subject to theme. Light is based on this color.
//                         Note that info-dark should be preferred for use on light backgrounds.
//                         The info color is for use on darker backgrounds only.
// direction   (optional) - text/enum - 'right', 'down', 'left', 'up'
// size        (optional) - text/enum - 'xsmall', 'small', 'medium', 'large'
//                         Note: medium is actually larger than the default
// fill        (optional) - boolean - use a fill icon style when true. When combined with color parameter
//                                   renders a colored container
// Usage:
//
// <icon params="isVisible: showNow, icon:'add', color: 'dark'"></icon>
//
// Notes:
// The template (markup) for this component can be found in ./_Icon.html
//
// When placing icons on a page, be cognizant of the "scope" of the icon. Icons don't typically convery information 
// on their own; they should usually be placed alongside meaningful content (for accessibility).
//
define(['text!Icon/_Icon.html'], function (markup) {
    function IconViewModel(params) {
        var self = this;

        try {

            if (typeof (params.isVisible) === "undefined") {
                throw "Please provide a valid isVisible value.";
            }
            if (typeof (params.icon) === "undefined") {
                throw "Please provide a valid icon value.";
            }

            self.isVisible = ko.isObservable(params.isVisible) ? params.isVisible : ko.observable(params.isVisible);

            self.title = ko.computed(function () {
                if (typeof (params.title) === "undefined" || !ko.unwrap(params.title)) {
                    return '';
                }
                return ko.isObservable(params.title) ? params.title : ko.observable(params.title);
            })

            self.description = ko.computed(function () {
                if (typeof (params.description) === "undefined" || !ko.unwrap(params.description)) {
                    return '';
                }
                return ko.isObservable(params.description) ? params.description : ko.observable(params.description);
            })

            self.iconId = ko.computed(function () {
                var value = "";
                var icon = ko.unwrap(params.icon);
                switch (icon) {
                    case "add":
                    case "approve":
                    case "arrow":
                    case "arrow-double":
                    case "avatar":
                    case "calendar":
                    case "calendar-term":
                    case "cards":
                    case "check":
                    case "clock":
                    case "clear":
                    case "close":
                    case "comment":
                    case "delete":
                    case "deny":
                    case "document":
                    case "drag":
                    case "edit":
                    case "email":
                    case "error":
                    case "export":
                    case "favorite":
                    case "filter":
                    case "folder-open":
                    case "folder-closed":
                    case "graduation":
                    case "group":
                    case "help":
                    case "hide":
                    case "home":
                    case "image":
                    case "in-progress":
                    case "info":
                    case "list":
                    case "location":
                    case "lock":
                    case "lookup":
                    case "menu":
                    case "more":
                    case "new-document":
                    case "notification":
                    case "print":
                    case "refresh":
                    case "save":
                    case "search":
                    case "settings":
                    case "share":
                    case "skip":
                    case "swap":
                    case "unlock":
                    case "view":
                    case "warning":                    
                    case "note":
                    case "note-alert":
                        value = "#icon-" + icon;
                        break;
                    default:
                        throw "Invalid icon value provided!"
                }
                return value;
            });
            

            self.uniqueTitleId = ko.computed(function () {
                return ko.unwrap(params.icon) + '-title-' + guidGenerator() + ' '
            })

            self.uniqueDescId = ko.computed(function () {
                return ko.unwrap(params.icon) + '-desc-' + guidGenerator();
            })

            self.uniqueCombinedId = ko.computed(function () {
                return self.uniqueTitleId() + ' ' + self.uniqueDescId();
            })

            self.fillColor = ko.computed(function () {
                if (typeof (params.fill) === "undefined" || !ko.unwrap(params.fill)) {
                    return '';
                }
                var color = ko.unwrap(params.color);
                var value = 'esg-icon__container--fill';
                switch (color) {
                    case 'light':
                    case 'neutral':
                    case 'info':
                    case 'info-dark':
                    case 'warning':
                    case 'warning-dark':
                    case 'error':
                    case 'error-dark':
                    case 'success':
                    case 'success-dark':
                        value += " esg-icon__container--" + color;
                        break;
                    default:
                        break;
                }
                return value;
            });

            self.iconClasses = ko.computed(function () {
                var value = "esg-icon";
                if (typeof (params.direction) !== "undefined") {
                    var direction = ko.unwrap(params.direction)
                    switch (direction) {
                        case "right":
                        case "down":
                        case "left":
                        case "up":
                            value += " esg-icon--" + direction;
                            break;
                        default:
                            throw "Invalid direction value provided!";
                    }
                }
                if (typeof (params.size) !== "undefined") {
                    var size = ko.unwrap(params.size)
                    switch (size) {
                        case "xsmall":
                        case "small":
                        case "medium":
                        case "large":
                            value += " esg-icon--" + size;
                            break;
                        default:
                            throw "Invalid size value provided!";
                    }
                }
                if (typeof (params.color) !== "undefined") {
                    var color = ko.unwrap(params.color);
                    switch (color) {
                        case 'light':
                        case 'neutral':
                        case 'info':
                        case 'info-dark':
                        case 'warning':
                        case 'warning-dark':
                        case 'error':
                        case 'error-dark':
                        case 'success':
                        case 'success-dark':
                            value += " esg-icon--" + color;
                            break;
                        default:
                            break;
                    }
                }
                return value;
            });
        } catch (error) {
            console.log(error);
        }
    }
    return { viewModel: IconViewModel, template: markup };
});