(async function() {
    if (location != 'chrome://browser/content/browser.xul')
        return;  
    var urlbar = document.getElementById('urlbar-container');
    var results = document.getElementById('PopupAutoCompleteRichResult');

    urlbar.appendChild(results);
}()); 
