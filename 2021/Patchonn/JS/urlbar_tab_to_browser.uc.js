
// smh
(function() {
    let urlbar = document.getElementById("urlbar");
    
    urlbar.addEventListener("keydown", function(e){
        if(e.keyCode == 9){
            e.target.ownerDocument.defaultView.gBrowser.selectedTab.linkedBrowser.focus();
            e.preventDefault();
            e.stopPropagation();
        }
    });
})();
