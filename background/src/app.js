define(['player'], function(player) {
	'use strict';

	var playit = new player();

	chrome.contextMenus.onClicked.addListener(function(item) {
		var clear = item.menuItemId == 'now';
		playit.play(item.linkUrl, clear);
	});
});