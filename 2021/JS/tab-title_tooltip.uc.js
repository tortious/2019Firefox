// ==UserScript==
// @name                 dav_tab_title_url.uc
// @version              1.0
// @description          dav_tab_title_url.uc
// ==/UserScript==

/*
Idea based on
https://github.com/LouCypher/tab-tooltip-url
it shows the web address in the tooltip when you hover over the tab w the mouse
*/

(function(){
	if(location.href != 'chrome://browser/content/browser.xhtml') return;

	var linkifiesUrl = true;

function linkifiesLocationBar(url)
{
	const colorizeExtensionFile = false;
	const CLIKS = {
		left: 0,
		middle: 1,
		right: 2
	}

	var styleString = (style) => {
		return Object.keys(style).reduce((prev, curr) => {
			return `${prev += curr.split(/(?=[A-Z])/).join('-').toLowerCase()}:${style[curr]};`
		}, '');
	};

	function createElement(elto) {
		elto = Object.assign({
			attr: {},
			evtListener: [],
			estilos: {}
		}, elto);
		var node = document.createElement(elto.type);

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
			}
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
			console.log("href", href);
			evt.stopPropagation();
		}
	}
	var divLocationBar = createElement({
		type: "div",
		attrArray: {
			class: "claseLocationBarTooltip"
		}
	});
	
	try {
		var { protocol, hostname, port, pathname, hash, search } = new URL(url);
	} catch (e) {
		divLocationBar.innerHTML = encodeHTML(url);
		return divLocationBar;
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

	return divLocationBar;	
}


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
function asignaEstilos(){
	var style = `
	
	/*************************************
	*************** COLORS ***************
	*************************************/
	.claseLocationBarTooltip{
	  font-family:courier ;
	  margin:5px;
	}
	.claseLocationBarTooltip .label_pathname{
		color: black;
	}
	.claseLocationBarTooltip span.protocol{
		font-weight: normal;
		color: #777777;
		margin-right: -1px;
	}
	.claseLocationBarTooltip .subdomain {
		font-weight: bold;
		color: #C68007;
	}
	.claseLocationBarTooltip span.hostname{
		font-weight: bold;
		color: red;
	}
	.claseLocationBarTooltip span.port{
		color: #5F58A3;
	}
	.claseLocationBarTooltip span.pathname{
		color: black;
	}
	.claseLocationBarTooltip span.hash{
		color: #1054C9;
		margin-left: -1px;
	}
	.claseLocationBarTooltip span.search{
		color: #03AA03;
		margin-left: -1px;
	}
	.claseLocationBarTooltip .extension{
		color: rgb(96,86,143);
	}

	/*************************************
	*************** Flecha pathname ***************
	************************************
	.claseLocationBarTooltip .pathname:after{
		content:' ';
		display: block;
		position: absolute;
		border-style: solid;
		border-width: 4px 4px 4px 7px;
		border-color: transparent transparent transparent #6fa880;
		top: 3px;
		left: 0px;	
		width: 0px;
		height: 0px;
	}
	.claseLocationBarTooltip span.pathname{
		padding-left:9px;
		margin: 0 2px;
	}
	.claseLocationBarTooltip,
	.claseLocationBarTooltip span{
		position: relative;
		display: inline-block;
	}
	.claseLocationBarTooltip .label_pathname{
		display: none;
	}
	*/
    `;
	CSS_Loader.load(style);
}
	
	
	var styleString = (style) => {
		return Object.keys(style).reduce((prev, curr) => {
			return `${prev += curr.split(/(?=[A-Z])/).join('-').toLowerCase()}:${style[curr]};`
		}, '');
	};
	function encodeHTML(text) {
		return decodeURI(text).replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}
	function createElement(elto) {
		elto = Object.assign({
			attr: {},
			evtListener: [],
			estilos: {}
		}, elto);
		var node = window.document.createXULElement(elto.type);
		Object.keys(elto.attr).forEach(key => {
			if(key == "innerHTML"){
				node.innerHTML = encodeHTML(elto.attr[key]);
			}
			if(key == "textContent"){
				node.textContent = elto.attr[key];
			}			
			else {
				node.setAttribute(key, elto.attr[key]);
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
	function getTabElto(target){
		if(!target || target.nodeName == "tab"){
			return target;
		}else{
			return getTabElto(target.parentNode);
		}
	}
	function showing(tip, target){
		var tab = getTabElto(target);
		if(!tab) return false;
		tip.textContent = "";
		tip.appendChild(getTooltipData(tab));
	}
	function getTooltipData(tab){
		var titulo = createElement({
			type:"label",
			attr:{
				innerHTML: tab.getAttribute("label"),
			},
			estilos:{
				color:"black",
				display:"block",
				fontWeight: "bold",
				fontFamily: "monospace",
				margin:"5px"
			}
		});
		var url;
		
		if(linkifiesUrl)
		{
			url = linkifiesLocationBar(tab.linkedBrowser.currentURI.spec);
		}
		else
		{
			 url = createElement({
				type:"label",
				attr:{
					innerHTML: tab.linkedBrowser.currentURI.spec,
					class:"xyz"
				},
				estilos:{
					color:"blue",
					fontFamily: "monospace",
					margin:"5px"
				}
			});
		}
		
		var df = document.createDocumentFragment();
		df.appendChild(titulo);
		df.appendChild(url);
		return df;
	}
	function hidding(){
	}
	var tipId = "dav_tab_title_url"
	var tip = createElement({
		type:"tooltip",
		attr:{
			id: tipId,
			orient: "vertical",
			onpopupshowing: "return this.showing(this, document.tooltipNode);",
			onpopuphiding: "this.hidding();"
		}
	});
	tip.showing = showing;
	tip.hidding = hidding;
	var arrowscrollbox = document.getElementById("tabbrowser-arrowscrollbox")
	arrowscrollbox.removeAttribute("tooltiptext");
	arrowscrollbox.setAttribute("tooltip", tipId);
	arrowscrollbox.setAttribute("popupsinherittooltip", "true");
	document.getElementById("mainPopupSet").appendChild(tip);
	tip.textContent = "";
	if(linkifiesUrl){
		asignaEstilos();	
	}	
})();
