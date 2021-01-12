// ==UserScript==
// @name                 dav_LinkifiesLocationBar
// @version              1.0
// @description          dav_LinkifiesLocationBar
// @shutdown        dav_LinkifiesLocationBar.globalShutdown();
// ==/UserScript==

/*
Idea based on
https://addons.mozilla.org/en-US/firefox/addon/locationbar%C2%B2/
https://github.com/simonlindholm/locationbar2
*/
setTimeout(function() {
	if (location.href != 'chrome://browser/content/browser.xhtml') return;

	const colorizeExtensionFile = false,
		selectUrlbarText = true;

	function getWindow(){
		return window;
	}
	function getMostRecentWindow(){
		var win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator)
			.getMostRecentWindow("navigator:browser");
		return win;
	}
	var localWindow = getWindow();
	localWindow.dav_LinkifiesLocationBar = {};

    var style = `
		@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");
		.claseLocationBar{
		   display: block;
		   position: absolute;
		   height: 24px;
		   width: 100%;
		   line-height: 24px;
		   white-space:nowrap;
		   overflow:hidden;
		}
		.claseLocationBar span{
			position: relative;
		   margin: 0 1px;
		   display: inline-block;
		}
		.claseLocationBar span:hover{
			text-decoration: underline;
		    cursor: pointer;
		}
		.claseLocationBar span.pathname{
		   padding-left:9px;
		   margin: 0 2px;
		}
		.claseLocationBar .pathname:after{
		  content:' ';
		  display: block;
		  position: absolute;
		  border-style: solid;
		  border-width: 4px 4px 4px 7px;
		  border-color: transparent transparent transparent #6fa880;
		  top: 10px;
		  left: 0px;
		}
		.claseLocationBar .label_pathname{
		   display: none;
		}
		/*************************************
		*************** COLORS ***************
		*************************************/
		.claseLocationBar span.protocol{
		   font-weight: normal;
		   color: #777777;
		   margin-right: -1px;
		}
		.claseLocationBar .subdomain {
		   font-weight: bold;
		   color: #C68007;
		}
		.claseLocationBar span.hostname{
		   font-weight: bold;
		   color: red;
		}
		.claseLocationBar span.port{
		   color: #5F58A3;
		}
		.claseLocationBar span.pathname{
		   color: black;
		}
		.claseLocationBar span.hash{
		   color: #1054C9;
		   margin-left: -1px;
		}
		.claseLocationBar span.search{
		   color: #03AA03;
		   margin-left: -1px;
		}
		.claseLocationBar .extension{
		    color: rgb(96,86,143);
		}
		/*************************************
		***************  font-family: monospace; ***************
		*************************************/
		/*
		.urlbar-input-box[dav_LinkifiesLocationBar]{
		  font-family: monospace;
			line-height: 24px;
		}
		.claseLocationBar{
		 line-height: 28px;
		}
		.claseLocationBar .pathname:after{
		  top: 10px;
		}
		.claseLocationBar span.port{
			margin-left: -1px;
		}
		.claseLocationBar .subdomain {
		  margin-right: -1px;
		}
		.claseLocationBar span.hostname{
		  margin-right: 1px;
		}
		*/
		/*.claseLocationBar label {
			margin-block: unset !important;
			margin-inline: unset !important;
		}*/
		locationBarTag{
		  display: inline;
		}
    `;

	var stylexul = `
		.urlbar-input-box[dav_LinkifiesLocationBar] #urlbar-input:focus ~ .claseLocationBar{
		   display: none !important;
		}
		.urlbar-input-box[dav_LinkifiesLocationBar]  #urlbar-input:focus{
		   opacity: 1;
		}
		.urlbar-input-box[dav_LinkifiesLocationBar]  #urlbar-input{
		   opacity: 0;
		}
    `;

/*
AGENT_SHEET: 0
​USER_SHEET: 1
AUTHOR_SHEET: 2
*/
	var CSS_Loader = {
		sss: Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService),
		load: function(cssCode) {
			this.unload(cssCode);
			var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(cssCode), null, null);
			this.sss.loadAndRegisterSheet(uri, this.sss.AGENT_SHEET);
		},
		unload: function(cssCode) {
			var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(cssCode), null, null);
			if (this.sss.sheetRegistered(uri,this.sss.AGENT_SHEET))
			{
				this.sss.unregisterSheet(uri,this.sss.AGENT_SHEET);
			}
		}
	}

	const CLIKS = {
		left: 0,
		middle: 1,
		right: 2
	}

	function extend() {
		var copy, target = {};
		for (var i = 0, l = arguments.length; i < l; i++) {
			var options = arguments[i];
			for (var name in options) {
				copy = options[name];
				if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
		return target;
	}

	var styleString = (style) => {
		return Object.keys(style).reduce((prev, curr) => {
			return `${prev += curr.split(/(?=[A-Z])/).join('-').toLowerCase()}:${style[curr]};`
		}, '');
	};

	function createElement(elto) {
		elto = extend({
			attrArray: {},
			evtListener: [],
			estilos: {}
		}, elto);

		var node = getWindow().document.createXULElement(elto.type);

		Object.keys(elto.attrArray).forEach(key => {
			if(key == "innerHTML"){
				node.innerHTML = encodeHTML(elto.attrArray[key]);
			}
			else {
				node.setAttribute(key, elto.attrArray[key]);
			}
		});

		elto.evtListener.forEach(evt => {
			node.addEventListener(evt.type, evt.funcion, false);
		});

		let estilo = styleString(elto.estilos);
		if (estilo) {
			node.setAttribute("style", estilo);
		}

		return node;
	}

	function encodeHTML(text) {
		return decodeURI(text).replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}

	function appendPart(text, clase) {
		if (!text) return;

		if(clase == "pathname")
		{
			let sp = createElement({
				type: "label",
				attrArray: {
					class: "label_pathname",
					innerHTML:"/"
				}
			});
			divLocationBar.appendChild(sp);
		}
		let sp = createElement({
			type: "span",
			attrArray: {
				class: clase,
				innerHTML:text
			},
			evtListener: [{
				type: "click",
				funcion: clickPart
			}]
		});
		divLocationBar.appendChild(sp);
		sp.setAttribute("href", divLocationBar.textContent);
		return sp;
	}

	function clickPart(evt) {
		if (evt.button == CLIKS.right) return;

		let target = evt.target;
		if (target.className != "protocol") {
			let href = target.getAttribute("href");
			var where = evt.button == CLIKS.middle || evt.ctrlKey ? "tab" : "current";
			evt.view.openLinkIn(href, where, {
				allowThirdPartyFixup: true,
				targetBrowser: gBrowser.selectedBrowser,
				indicateErrorPageLoad: true,
				allowPinnedTabHostChange: true,
				disallowInheritPrincipal: true,
				allowPopups: false,
				triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
			});

			evt.stopPropagation();
		}
	}

	function borraPrevio() {
		var divPrevio = localWindow.document.querySelector(".claseLocationBar");
		if (divPrevio) {
			divPrevio.parentNode.removeChild(divPrevio)
		}
	}

	var debounce = (fn, ms = 0) => {
	  let timeoutId;
	  return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	  };
	};

	var pintaLocation = debounce(pintaLocation_, 50);

	function pintaLocation_() {
		divLocationBar.innerHTML = '';

		var urlBarInput = getWindow().document.querySelector("#urlbar-input").value;
		var urlGBrowser = gBrowser.currentURI.displaySpec;

		if(urlGBrowser.startsWith("about")){
			divLocationBar.innerHTML = encodeHTML(urlBarInput);
			return;
		}

		var url = urlGBrowser.indexOf(urlBarInput) != -1 ? urlGBrowser : urlBarInput;

		try {
			var { protocol, hostname, port, pathname, hash, search } = new URL(url);
		} catch (e) {
			divLocationBar.innerHTML = encodeHTML(urlBarInput);
			return;
		}

		var partido = hostname.split(".");
		var subdomain;
		if(partido.length > 2 && !partido.every( v => v == v-0 ))//chequeamos que no sean todos numeros, porque entonces es una IP
		{
			subdomain = partido.splice(0, partido.length-2).join(".");
			hostname= partido.join(".");
		}

		appendPart(protocol + "//", "protocol");
		if (subdomain) {
			appendPart(subdomain+".", "subdomain");
		}
		appendPart(hostname, "hostname");
		if (port) {
			appendPart(":" + port, "port");
		}
		var arrayPathname = pathname.split("/");
		var arrayPathnameLength = arrayPathname.length;
		arrayPathname.forEach((elto, index) => {
			if (elto) {
				let sp = appendPart(elto, "pathname");
				if(colorizeExtensionFile && index == arrayPathnameLength-1)
				{
					let arrayDot = elto.split(".");
					if(arrayDot.length > 1)
					{
						let extension = arrayDot.pop();
						sp.innerHTML = "";
						sp.appendChild(createElement({
							type: "locationBarTag",
							attrArray: {
								href:sp.getAttribute("href"),
								innerHTML: arrayDot.join(".")
							}
						}));
						sp.appendChild(createElement({
							type: "locationBarTag",
							attrArray: {
								class: "extension",
								href:sp.getAttribute("href"),
								innerHTML: "."+extension
							}
						}));
					}
				}
			}
		});
		appendPart(search, "search");
		appendPart(hash, "hash");
	}

	/******************* INIT ***************************/
	var urlbarInput = getWindow().document.querySelector("#urlbar-input");
	var timeMouseMove = -1;
	function hideDivLocatonBar(){
		urlbarInput.focus();
	}
	var divLocationBar = createElement({
		type: "div",
		attrArray: {
			class: "claseLocationBar"
		},
		evtListener: [{
			type: "click",
			funcion: function(evt) {
				hideDivLocatonBar()
				if(selectUrlbarText){
					urlbarInput.select();
				}
			}
		},{
			type: "mouseenter",
			funcion: function(evt) {
				//esto es el ratón entrando por encima
				if(evt.screenY == divLocationBar.screenY)
				{
					timeMouseMove = setTimeout(hideDivLocatonBar, 500);
				}
			}
		},{
			type: "mouseleave",
			funcion: function(evt) {
				clearTimeout(timeMouseMove);
			}
		}]
	});

	borraPrevio();
	urlbarInput.parentNode.appendChild(divLocationBar);
	urlbarInput.parentNode.setAttribute("dav_LinkifiesLocationBar", true);
	urlbarInput.addEventListener("blur", pintaLocation);
	pintaLocation();

	var last_displaySpec = "";
	var intevalID = setInterval(function(){
		//console.log("setInterval", intevalID,  localWindow == window, localWindow == getMostRecentWindow());
		let actual_displaySpec = gBrowser.currentURI.displaySpec;
		if(last_displaySpec != actual_displaySpec){
			last_displaySpec = actual_displaySpec;
			pintaLocation();
		}
	}, 50);
	CSS_Loader.load(style);
	CSS_Loader.load(stylexul);
	/******************* END INIT ***************************/
	dav_LinkifiesLocationBar.shutdown = function(win){
		borraPrevio();
		clearTimeout(intevalID);
		urlbarInput.parentNode.removeAttribute("dav_LinkifiesLocationBar");
		CSS_Loader.unload(style);
		CSS_Loader.unload(stylexul);
		urlbarInput.removeEventListener("blur", pintaLocation);
	}

	dav_LinkifiesLocationBar.globalShutdown = function(){
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
					.getService(Components.interfaces.nsIWindowMediator);
		var ws = wm.getEnumerator(null);
		while(ws.hasMoreElements()) {
			var w = ws.getNext();
			w.dav_LinkifiesLocationBar.shutdown(w);
		}
	}
}, 10);
