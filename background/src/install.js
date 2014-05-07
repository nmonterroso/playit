chrome.runtime.onInstalled.addListener(function(details) {
	'use strict';

	var perm_list = [];

	chrome.runtime.getManifest().permissions.forEach(function(p) {
		if (p.indexOf('://') != -1) { // kinda ghetto, but check to see that it's some form of web url
			perm_list.push(p+'*');
		}
	});

	// TODO: add icons
	chrome.contextMenus.create({
		'id': 'next',
		'title': 'Next',
		'contexts': ['link'],
		'targetUrlPatterns': perm_list
	});

	chrome.contextMenus.create({
		'id': 'last',
		'title': 'Last',
		'contexts': ['link'],
		'targetUrlPatterns': perm_list
	});

	chrome.contextMenus.create({
		'id': 'now',
		'title': 'Now',
		'contexts': ['link'],
		'targetUrlPatterns': perm_list
	});
});