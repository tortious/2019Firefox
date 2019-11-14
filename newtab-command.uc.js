(async function() {
    async function waitSelector(parent, query, exists) {
        exists = exists !== undefined ? !!exists : true;
        return new Promise((resolve) => {
            let observer = new MutationObserver(function(mutationsList, observer) {
                for(var mutation of mutationsList) {
                    let elem = parent.querySelector(query);
                    if(exists == (elem !== null)) {
                        observer.disconnect();
                        resolve(elem);
                    }
                }
            });
            observer.observe(parent, { attributes: false, childList: true, subtree: true });
        });
    }
    
    /*
    let newtab = document.getElementById("tabs-newtab-button");
    newtab.removeAttribute("command");
    newtab.removeAttribute("oncommand");
    newtab.setAttribute("onclick", "BrowserOpenTab()");
    */
    
    // need to filter rightclick somehow
    let newtab_full = document.getElementById("new-tab-button");
    console.log(newtab_full);
    console.log(await waitSelector(document, "#new-tab-button"));
    newtab_full.removeAttribute("command");
    newtab_full.removeAttribute("oncommand");
    newtab_full.setAttribute("onclick", "BrowserOpenTab()");
}());
