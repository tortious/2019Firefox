(function(){
	if(location.href != 'chrome://browser/content/browser.xhtml') return;

	var debounce = (fn, ms = 0) => {
	  let timeoutId;
	  return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	  };
	};

	var listsUrlToPin = [
		"https://www.netvibes.com/*",
		"moz-extension://90d0a16d-2cb9-42fd-bb15-dbeb6351126b/reader.html*",
		"chrome://userchromejs/content/dav/speedDial/speedDial.html"
	];

	function asignaURL_(tabSelect)
	{
		try{
			let tab = tabSelect.target || tabSelect;//es un evento o una pestaña
			let url = tab.linkedBrowser.currentURI.spec;
			tab.setAttribute("stylish-url", url);
			if(tab == gBrowser.selectedTab)
			{
				document.getElementById("main-window").setAttribute("stylish-url", url);
			}
		}
		catch(e){
			console.log("ERROR: stylish-url", e);
		}
	}
	var asignaURL = debounce(asignaURL_, 100);

	var urls = [];
	listsUrlToPin.forEach(function(v) {
		if(v=='') return;
		v = v.replace(/([\.\\\*\[\]\(\)\+])/g, '\\$1');
		v = v.replace(/(\\\*)/g, '.*');
		urls.push(RegExp('^'+v+'$'));
	});

	function checkPin(url)
	{
		for(var v, i = 0;v = urls[i];i++)
		{
			if(v.test(url))
			{
				return true;
			}
		}
		return false;
	}

	function pinTab(tab)
	{
		try{
			var url = tab.linkedBrowser.currentURI.spec;
			var ponerPin = checkPin(url);
			if(ponerPin)
			{
				gBrowser.pinTab(tab);
			}
		}
		catch(e){
			console.log("ERROR: pinTab", e);
		}
	}

	Function.prototype.pre=function(g) {
		var f=this;
		return function() {
			g.apply(this, arguments);
			return f.apply(this, arguments);
		}
	};

	gBrowser.setTabTitle = gBrowser.setTabTitle.pre(function(tab) {
		pinTab(tab);
		asignaURL(tab);
	});

	setTimeout(function(){
		gBrowser.tabs.forEach(tab=>asignaURL_(tab));
	}, 1000)

	gBrowser.tabContainer.addEventListener('TabSelect', asignaURL, false);
	gBrowser.tabContainer.addEventListener('TabOpen', asignaURL, false);
	window.addEventListener('unload', function uninit(){
		gBrowser.tabContainer.removeEventListener('TabSelect', asignaURL, false);
		gBrowser.tabContainer.removeEventListener('TabOpen', asignaURL, false);
		window.removeEventListener('unload', uninit, false);
	}, false);
})();
