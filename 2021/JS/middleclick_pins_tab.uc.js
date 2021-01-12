// Middle Click On Tab
// Pin Tab 
var MiddleClickOnTab = {
  init: function() {  
	try {
      gBrowser.tabContainer.addEventListener('click', function abc(e) {
		  if(e.button==1
			&& e.target.localName == "tab")
		  {			
			e.stopPropagation();
			e.preventDefault();
			// Code here
			var subTab = event.originalTarget;
			while(subTab.localName != "tab") {
				subTab = subTab.parentNode;
			}
			if(subTab.pinned){
				gBrowser.unpinTab(subTab);
			} else {
				gBrowser.pinTab(subTab);
			}
			// End code
		  }
	  }, true);
	} catch(e) {}
  }
}
setTimeout(function(){
  MiddleClickOnTab.init();
},1000);
