var logIt = false;
var dialogListener = false;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

/*
 * Find text enclosed in square brackets
 * e.g. [Offering(s): Also offered through Distance Education format.]
 * and present it as something that matches up with the delivered formatting.
 */
function reformatBracketContents(d) {
    if (d && d.innerHTML) {
        if (logIt) {
            console.log("reformetBracketContents");
            console.log(d);
        }
        //Split text in square brackets with values separated by colons, where the square brackets cannot be nested.
        var re = new RegExp("\\[([^\\[\\]]*?):([^\\[\\]]*?)\\]");
        var text = d.innerHTML;
        var bracketText;
        var vPad = "<br/><br/>";
        var changed = false;
        while ((bracketText = re.exec(text))) {
            if (logIt) {
                console.log('processing bracket "' + bracketText + '"');
            }
            changed = true;
            var lbl = bracketText[1];
            var value = bracketText[2];
            text = text.replace(
                bracketText[0],
                vPad +
                    '<div class="search-coursedataheader" width="20%">' +
                    lbl +
                    ":</div><div><span>" +
                    value +
                    "</span></div>"
            );
            vPad = ""; //reset since we only want the extra spacing on the first line.
        }
        if (changed) {
            d.innerHTML = text;
        }
    }
}

/* Scan for planned grad student registration course, and if present disable the bulk register button to prevent
 * an awkward infinite loop for the user.
 * As this thing grows, we should probably consider renaming the file.
 */
function checkForGradFillerCourse() {
    if (logIt) {
        console.log("checkForGradFillerCourse");
    }
    var schedEl = document.getElementById("schedule-data");

    if (schedEl) {
        var schedModel = ko.contextFor(schedEl);
        if (schedModel && schedModel.$data && schedModel.$data.PlannedCourses) {
            var PlannedCourses = schedModel.$data.PlannedCourses();
            PlannedCourses.forEach((c) => {
                if (logIt) {
                    console.log(c.CourseName());
                    console.log(c);
                }
                if (
                    c.IsPlanned() &&
                    (c.CourseName() === "UNIV-7510" ||
                        c.CourseName() === "UNIV-7520")
                ) {
                    $("#register-button").prop("disabled", true);
                }
            });
        }
    }
}

/*
 * Watch for changes to the section details dialog, and reformat the text to gussy up the square bracketed notes.
 * This observer responds to all types of changes to the observed element, so it needs to be setup with a limited
 * scope.
 */
var crsDialogSquareBracketObserver = new MutationObserver(function (
    domChanges
) {
    if (logIt) {
        console.log("Change observed in course desc dialog");
        console.log(domChanges);
    }

    reformatBracketContents(
        document.getElementById("coursedetails-description")
    );
});

var sectDialogSquareBracketObserver = new MutationObserver(function (
    domChanges
) {
    if (logIt) {
        console.log("Change observed in section desc dialog");
        console.log(domChanges);
    }

    reformatBracketContents(
        document.getElementById("sectiondetails-description")
    );
});


/*
 * The observer used on course catalog and search results pages.
 * assigned in both SearchResult.cshtml views (~\Areas\Student\Views\Courses & ~\Views\Courses\)
 */
var courseCatalogueObserver = new MutationObserver(function (domChanges) {
    if (logIt) {
        console.log("courseCatalogueObserver");
    }
    domChanges.forEach(function (domChange) {
        var list = domChange.addedNodes;
        if (logIt) {
            console.log("added nodes list length " + list.length);
        }
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            var nName = el.nodeName;
            if (nName === "#text" || nName === "#comment") {
                continue;
            }
            //This is surprisingly fast -- it processes all displayed results on the SearchResults pages
            el.querySelectorAll(
                ".search-coursedatarow > .search-coursedescription"
            ).forEach((d) => {
                reformatBracketContents(d);
            });
        }
    });
    //Search results also contain links that open the dialog, if the dialog exists add an observer to it
    //addReformattingObserverToDetailDialogs();
});


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

/*
 * Watch for changes to the section details dialog, and reformat the text to gussy up the square bracketed notes.
 * This observer responds to all types of changes to the observed element, so it needs to be setup with a limited
 * scope.
 */
var crsDialogSquareBracketObserver = new MutationObserver(function (
    domChanges
) {
    if (logIt) {
        console.log("Change observed in course desc dialog");
        console.log(domChanges);
    }

    reformatBracketContents(
        document.getElementById("coursedetails-description")
    );
});

var sectDialogSquareBracketObserver = new MutationObserver(function (
    domChanges
) {
    if (logIt) {
        console.log("Change observed in section desc dialog");
        console.log(domChanges);
    }

    reformatBracketContents(
        document.getElementById("sectiondetails-description")
    );
});


/*
 * The observer used on course catalog and search results pages.
 * assigned in both SearchResult.cshtml views (~\Areas\Student\Views\Courses & ~\Views\Courses\)
 */
var courseCatalogueObserver = new MutationObserver(function (domChanges) {
    if (logIt) {
        console.log("courseCatalogueObserver");
    }
    domChanges.forEach(function (domChange) {
        var list = domChange.addedNodes;
        if (logIt) {
            console.log("added nodes list length " + list.length);
        }
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            var nName = el.nodeName;
            if (nName === "#text" || nName === "#comment") {
                continue;
            }
            var descDiv = document.querySelector("#coursedetails-description");
            if(descDiv && descDiv.style){
                descDiv.style.maxHeight = "none";
            }
            //This is surprisingly fast -- it processes all displayed results on the SearchResults pages
            el.querySelectorAll(
                ".search-coursedatarow > .search-coursedescription"
            ).forEach((d) => {
                reformatBracketContents(d);
            });
        }
    });
    //Search results also contain links that open the dialog, if the dialog exists add an observer to it
    //addReformattingObserverToDetailDialogs();
});


/*
 * Find text enclosed in square brackets
 * e.g. [Offering(s): Also offered through Distance Education format.]
 * and present it as something that matches up with the delivered formatting.
 */
function reformatBracketContents(d) {
    if (d && d.innerHTML) {
        if (logIt) {
            console.log("reformetBracketContents");
            console.log(d);
        }
        //Split text in square brackets with values separated by colons, where the square brackets cannot be nested.
        var re = new RegExp("\\[([^\\[\\]]*?):([^\\[\\]]*?)\\]");
        var text = d.innerHTML;
        var bracketText;
        var vPad = "<br/><br/>";
        var changed = false;
        while ((bracketText = re.exec(text))) {
            if (logIt) {
                console.log('processing bracket "' + bracketText + '"');
            }
            changed = true;
            var lbl = bracketText[1];
            var value = bracketText[2];
            text = text.replace(
                bracketText[0],
                vPad +
                    '<div class="search-coursedataheader" width="20%">' +
                    lbl +
                    ":</div><div><span>" +
                    value +
                    "</span></div>"
            );
            vPad = ""; //reset since we only want the extra spacing on the first line.
        }
        if (changed) {
            d.innerHTML = text;
        }
    }
}

/* Scan for planned grad student registration course, and if present disable the bulk register button to prevent
 * an awkward infinite loop for the user.
 * As this thing grows, we should probably consider renaming the file.
 */
function checkForGradFillerCourse() {
    if (logIt) {
        console.log("checkForGradFillerCourse");
    }
    var schedEl = document.getElementById("schedule-data");

    if (schedEl) {
        var schedModel = ko.contextFor(schedEl);
        if (schedModel && schedModel.$data && schedModel.$data.PlannedCourses) {
            var PlannedCourses = schedModel.$data.PlannedCourses();
            PlannedCourses.forEach((c) => {
                if (logIt) {
                    console.log(c.CourseName());
                    console.log(c);
                }
                if (
                    c.IsPlanned() &&
                    (c.CourseName() === "UNIV-7510" ||
                        c.CourseName() === "UNIV-7520")
                ) {
                    $("#register-button").prop("disabled", true);
                }
            });
        }
    }
}

waitForElm("#main-content").then( (elm) => {
    crsDialogSquareBracketObserver.observe(elm, { childList: true, subtree: true });
    sectDialogSquareBracketObserver.observe(elm, { childList: true, subtree:true });
});
