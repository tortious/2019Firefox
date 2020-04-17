// movable ui

(function() {
    let movable = [
        // unfortunately, these don't work like this
        //"PanelUI-button",
        //"nav-bar-overflow-button",
        "back-button",
        "forward-button",
        "urlbar-container",
    ];
    
    for(let id of movable) {
        try {
            document.getElementById(id).setAttribute("removable", "true");
        } catch(e) {}
    }
})();
