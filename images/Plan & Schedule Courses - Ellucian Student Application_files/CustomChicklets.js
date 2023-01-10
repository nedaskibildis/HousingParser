//Add it to the menu
var menuContainer = document.getElementById("nav-root");
var firstMenuItem = menuContainer.firstElementChild;
//var lastMenuItem = menuContainer.lastElementChild;
var newMenu = firstMenuItem.cloneNode(true);
var anchor = newMenu.querySelector("a");
anchor.id = "nav-news-and-resources";
anchor.dataset.menuId = "g82-news";
anchor.dataset.menuItemId = "g82-nav-news";
anchor.dataset.bind =
    "tooltip: { position: 'right', message: 'News and Resources' }";
anchor.innerHTML = "News and Resources";
//Defined in _Layout.cshtml as global
anchor.href = g82landingLinkUrl;
menuContainer.insertBefore(newMenu, firstMenuItem.nextSibling);

//And now the chicklet
var firstChicklet = document.querySelector(".sitehome-expandednavlink");
if (firstChicklet) {
    //The chicklet doesn't exist, so presumably we're not on the homepage...
    //Leave it at just adding the menu.
    var newChicklet = firstChicklet.cloneNode(true);
    var link = newChicklet.querySelector("a");
    //Defined in _Layout.cshtml as global
    link.href = g82landingLinkUrl;
    var heading = newChicklet.querySelector("h3");
    heading.id = "announcments-link";
    heading.innerHTML = "News and Resources";

    var span = newChicklet.querySelector("span");
    span.innerHTML =
        "Here you can read important announcements and access helpful links and resources.";

    var div = newChicklet.querySelector("div");
    div.className = "g82-news-announcements-chicklet";
    var container = firstChicklet.parentElement;
    //2022-05-24 switched to appendChild for IE11
    container.appendChild(newChicklet);
}
