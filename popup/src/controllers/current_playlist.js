define(['angular', 'underscore', 'jquery'], function(ng, _, $) {
	'use strict';

	ng.module('playit.controllers')
		.controller(
			'current_playlist_controller',
			[
				'$scope', '$rootScope', 'chrome_service',
				function($scope, $rootScope, chrome) {
//					chrome.query(chrome.type_playlist, 'details', function(playlist) {
//
//					});
				}
			]
		);
});