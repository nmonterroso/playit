define(['playit', 'chrome_service'], function(playit, chrome_service) {
	'use strict';

	chrome_service.set_playit(playit);

	chrome.contextMenus.onClicked.addListener(function(item) {
		var clear = item.menuItemId == 'now';
		var next = item.menuItemId == 'next';

		playit.play(item.linkUrl, next, clear);
	});

	chrome.runtime.onConnect.addListener(function(port) {
		chrome_service.set_port(port);
	});
});