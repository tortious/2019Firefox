// ==UserScript==
// @name            Enter Selects
// @author          xiaoxiaoflood
// @include         main
// @startup         UC.enterSelects.exec(win);
// @shutdown        UC.enterSelects.destroy();
// @onlyonce
// ==/UserScript==

// original: https://addons.mozilla.org/firefox/addon/enter-selects/

UC.enterSelects = {
  init: function () {
    this.orig_receiveResults = this.controller.receiveResults;
    this.controller.receiveResults = (function () {
      return function () {
        let gURLBar = this.browserWindow.gURLBar;
        if (UC.enterSelects.shouldSelect(gURLBar, arguments[0]))
          gURLBar.view._selectItem(gURLBar.view._rows.children[1], { updateInput: false});

        let  result =  UC.enterSelects.orig_receiveResults.apply(this, arguments);
        return result;
      };
    })();

    xPref.lock('browser.urlbar.autoFill', false);
    xPref.set('browser.urlbar.matchBuckets', 'general:1', true);
  },

  exec: function (win) {
    gURLBar.textbox.addEventListener('keydown', this.keyD, true);
  },

  controller: ChromeUtils.import('resource:///modules/UrlbarController.jsm').UrlbarController.prototype,

  shouldSelect: function (gURLBar, queryContext) {
    if (queryContext.lastResultCount < 1 || gURLBar.view.selectedIndex > 0)
      return false;

    let {value} = gURLBar;
    if (gURLBar.selectionEnd == value.length)
      value = value.slice(0, gURLBar.selectionStart);
    let search = value.trim();

    try {
      // Test if is URL
      return !Services.eTLD.getBaseDomainFromHost(search);
    } catch (ex) {}

    // Test about:about, chrome://blabla ... 
    if (/[a-zA-Z][\w-]*:(\/\/)?[\w-]+/.test(search))
      return false;

    // Check if the first word is a keyword (search or bookmark) or search suggestion (if enabled and there is no result)
    if (!!queryContext.results[0].payload.keyword || !queryContext.results[1].payload.displayUrl)
      return false;

    return true;
  },
  keyD: (e) => {
    let gURLBar = this.gURLBar;
    if (e.keyCode == e.DOM_VK_TAB) {
      let url = gURLBar.view._queryContext.results[1].payload.url;
      if (gURLBar.view.selectedIndex == 1 && gURLBar.value != url && new RegExp(/^(https?:\/\/(www\.)?)?/.source + gURLBar.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).test(url) && gURLBar.value != url.match(/(\w*:\/\/)?.+\..+?\//)[0]) {
        gURLBar.inputField.value = gURLBar._untrimmedValue = gURLBar.trimValue(url.match(/(\w*:\/\/)?.+\..+?\//)[0] + '/').slice(0, -1);
        /* quando browser.urlbar.trimURLs = true, trimValue() em url terminada em '.tld/' remove o '/', o que não é desejado porque a ideia deste "atalho" tab é facilitar o preenchimento de algo depois da barra. Eu não poderia adicionar um '/' depois do trimValue() porque em caso de trim desabilitado ficaria com duas barras. A solução mais prática é esta, incluir um caractere antes de aplicar o trimValue() para que a barra não seja removida, aí depois só remove este caractere adicionado. */
        gURLBar.view.close();
        e.preventDefault();
        e.stopPropagation();
      } else if (gURLBar.view.selectedIndex == -1) {
        gURLBar.view.selectedIndex = 1;
        gURLBar.value = url;
        e.preventDefault();
        e.stopPropagation();
      } else if (gURLBar.view.selectedIndex == 1 && gURLBar.value != url) {
        gURLBar.value = url;
        e.preventDefault();
        e.stopPropagation();
      }
    }
  },

  destroy: function () {
    xPref.unlock('browser.urlbar.autoFill');
    _uc.windows((doc, win) => {
      let gURLBar = win.gURLBar;
      this.controller.receiveResults = this.orig_receiveResults;
      gURLBar.textbox.removeEventListener('keydown', this.keyD, true);
    });
    delete UC.enterSelects;
  }
}

UC.enterSelects.init();
