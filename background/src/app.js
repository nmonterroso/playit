define(['player', 'chrome_service'], function(player, chrome_service) {
	'use strict';

	var playit = new player();
	chrome_service.set_player(playit);

	chrome.contextMenus.onClicked.addListener(function(item) {
		var clear = item.menuItemId == 'now';
		var next = item.menuItemId == 'next';

		playit.play(item.linkUrl, next, clear);
	});

	chrome.runtime.onConnect.addListener(function(port) {
		chrome_service.set_port(port);
	});
});