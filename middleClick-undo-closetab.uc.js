// ==UserScript==
// @name middle-click "Undo Close Tab"
// @description Kürzlich geschlossenen Tab mit Mittelklick wieder öffnen
// @version 1.1
// @include main
// @compatibility Firefox ESR31.3, 34.0.5, 69*
// @author oflow
// @mod aborix
// @namespace https://oflow.me/archives/265
// @note Firefox 31.3, 34.0.5 neuere nicht getestet
// @note remove arguments.callee
// @note mTabContainer -> tabContainer
// ==/UserScript==
(function() {
  if (!window.gBrowser)
    return;
  var ucjsUndoCloseTab = function(e) {
    // Nur mit Mittelkick
    if (e.button != 1) {
      return;
    }
    // Klick auf Tab-Leiste und die Neuer Tab Schaltflächen
    let node = e.originalTarget;
    while (node.localName != 'tab' && node.localName != 'toolbarbutton' && node.id != 'tabbrowser-tabs') {
      node = node.parentNode;
    }
    if (node.id == 'tabbrowser-tabs' || node.id == 'new-tab-button'
        || node.classList.contains('tabs-newtab-button')) {
      undoCloseTab(0);
      e.preventDefault();
      e.stopPropagation();
    }
  }
  // Schaltfläche Neuer Tab
  document.getElementById('new-tab-button').onclick = ucjsUndoCloseTab;
  // Tab-Leiste
  gBrowser.tabContainer.addEventListener('click', ucjsUndoCloseTab, true);
})();
