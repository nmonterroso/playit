define(['playit', 'chrome_service'], function(playit, chrome_service) {
	'use strict';

	chrome_service.set_playit(playit);

	chrome.contextMenus.onClicked.addListener(function(item) {
		playit.add(item.linkUrl, item.menuItemId);
	});

	chrome.runtime.onConnect.addListener(function(port) {
		chrome_service.set_port(port);
	});
});