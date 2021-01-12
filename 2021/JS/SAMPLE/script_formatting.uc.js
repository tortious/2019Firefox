(function() {
    let {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
    
    function processLoadedWindow(win) {
        // This function will be called every time a new window opens
        // This might include non-browser windows as well
        
        // You can replace the code in this function with anything you want,
        // but make sure to always reference everything starting from
        // the win argument instead of any global variable.
        /*
        let urlbar = win.document.getElementById("urlbar");
        if(urlbar !== null) {
            urlbar.addEventListener("keydown", function(e) {
                if(e.keyCode == 9) {
                    e.target.ownerDocument.defaultView.gBrowser.selectedTab.linkedBrowser.focus();
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }
        */
    }
    
    function processWindow(win) {
        // I'm not sure if this verification is needed or not
        let readyState = win.document.readyState;
        if(readyState === "complete" || readyState === "interactive") {
            processLoadedWindow(win);
            
        } else {
            win.addEventListener("load", function(){processLoadedWindow(win)});
        }
    }
    
    // Make sure to process the already existing window
    processWindow(window);
    
    function WindowObserver() {
        this.observe = function(subject, topic, data) {
            if(topic === "domwindowopened") {
                processWindow(subject);
            }
        }
    }
    
    Services.ww.registerNotification(new WindowObserver());
    
})();
