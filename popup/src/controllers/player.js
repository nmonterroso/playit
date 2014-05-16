define(['angular', 'underscore'], function(ng, _) {
	'use strict';

	ng.module('playit.controllers')
		.controller('player_controller', ['$scope', 'chrome_service', function($scope, chrome) {
			$scope.track = {
				image: '/popup/images/track_empty.jpg',
				title: null
			};

			var refresh = function() {
				chrome.query(chrome.type_playlist, 'track', function(track) {
					$scope.$apply(function() {
						$scope.track = track;
					});
				});
			};

			refresh();
		}])
		.directive('playerControl', function() {
			return {
				restrict: 'A',
				templateUrl: '/popup/templates/player.html'
			};
		});
});