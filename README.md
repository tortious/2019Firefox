# 2019Firefox

- [Here](https://github.com/tortious/userChrome.js-userChrome.css-Favorites/tree/master/2019Scripts) is a link to my other repo with firefox-related stuff.

- [Repo](https://github.com/dotiful/firefox-scripts) with all kinds of great firefox scripts 

- [Izheil's Baller Repo & Dark Theme](https://github.com/Izheil/Quantum-Nox-Firefox-Dark-Full-Theme)

- [Mr.OtherGuy's Dope Script Repo](https://github.com/MrOtherGuy/firefox-csshacks)

- [Firefox BLUEMOON Repo](https://github.com/GrosBourrin/FIREFOX-BLUE-MOON)

- [Patchon Repo](https://github.com/Patchonn/firefox-theme)

- [Aris T2's JS Repo](https://github.com/Aris-t2/CustomJSforFx)

- [Alice's Massive JS Repo](https://github.com/alice0775/userChrome.js)

- [My Frozenfox Repo](https://github.com/tortious/FrozenFox)

## Misc about:config Changes I Have Made

- browser.proton.enabled = false

- browser.tabs.warnOnClose = false

- browser.urlbar.suggest.topsites = false (popular sites aren't automatically shown when URL bar gains focus)

- browser.urlbar.suggest.openpage = false (open tabs aren't suggested when typing in the URL bar) 

- browser.urlbar.groupLabels.enabled = false

- browser.urlbar.sponsoredTopSites = false

- browser.compactmode.show = true

- devtools.debugger.prompt-connection = False (removes box requiring you to accept remote debugging when accessing browser toolbox)

- browser.urlbar.update1 = False (stops urlbar from looking all wonky in FF71. Prob  will be extinct soon as it matures, as suggested by the homie MrOtherGuy somewhere on r/firefoxcss recently. 

- browser.urlbar.formatting.enabled = False (stops the shading/highlighting styling in the urlbar)

- xpinstall.signatures.required = false

- extensions.experiments.enabled = true

- toolkit.legacyUserProfileCustomizations.stylesheets = true

- layers.acceleration.force-enabled = true

- gfx.webrender.all = true

- svg.context-properties.content.enabled = true

- browser.urlbar.openintab = true (when typing in the url and you hit enter, it opens the page in a new tab)

- browser.tabs.insertaftercurrent = true (open tabs to the right, always. Removes need for extension that does the same shit)

- browser.display.background_color = #1a1a1a (This stops the preloading blinding white shit. Finally!!!!)

- svg.context-properties.content.enabled

- layout.css.backdrop-filter.enabled

- gfx.webrender.enabled

- gfx.webrender.all

- layers.acceleration.force-enabled

- toolkit.legacyUserProfileCustomizations.stylesheets

- devtools.debugger.remote-enabled = true (Enables remote debugging/using the browser toolbox)

- devtools.chrome.enabled = true (enable devtools)

- 








## Misc Main Menu Ids & Classes

- id: appMenu-addon-banners
- class: panel-banner-item 
- id: appMenu-fxa-status, class: sync-ui-item 
- class: sync-ui-item 
- id: appMenu-tp-separator
- id: appMenu-new-window-button, class: subviewbutton subviewbutton-iconic 
- id: appMenu-private-window-button, class: subviewbutton subviewbutton-iconic 
- id: appMenuRestoreLastSession, class: subviewbutton subviewbutton-iconic 

- id: appMenu-zoom-controls, class: toolbaritem-combined-buttons 

- id: appMenu-edit-controls, class: toolbaritem-combined-buttons 

- id: appMenu-library-button, class: subviewbutton subviewbutton-iconic subviewbutton-nav 
- id: appMenu-logins-button, class: subviewbutton subviewbutton-iconic 
- id: appMenu-addons-button, class: subviewbutton subviewbutton-iconic 
- id: appMenu-preferences-button, class: subviewbutton subviewbutton-iconic 
- id: appMenu-customize-button, class: subviewbutton subviewbutton-iconic 

- id: appMenu-open-file-button, class: subviewbutton 
- id: appMenu-save-file-button, class: subviewbutton 
- id: appMenu-print-button, class: subviewbutton subviewbutton-iconic 

- id: appMenu-find-button, class: subviewbutton subviewbutton-iconic 
- id: appMenu-more-button, class: subviewbutton subviewbutton-nav 
- id: appMenu-developer-button, class: subviewbutton subviewbutton-nav 
- id: appMenu-whatsnew-button, class: subviewbutton subviewbutton-iconic subviewbutton-nav 
- id: appMenu-help-button, class: subviewbutton subviewbutton-iconic subviewbutton-nav 

- id: appMenu-quit-button, class: subviewbutton subviewbutton-iconic

- #appMenu-fxa-label
- #appMenu-protection-report-button,
- #appMenu-tp-separator,
- #appMenu-new-window-button,
- #appMenu-private-window-button,
- #appMenuRestoreLastSession,
- #appMenu-zoom-controls,
- #appMenu-edit-controls,
- #appMenu-library-button,
- #appMenu-logins-button,
- #appMenu-customize-button,
- #appMenu-open-file-button,
- #appMenu-save-file-button,
- #appMenu-find-button,
- #appMenu-more-button,
- #appMenu-developer-button,
- #appMenu-whatsnew-button
