define(['angular', 'underscore', 'jquery', 'jquery-ui'], function(ng, _, $) {
	'use strict';

	ng.module('playit.controllers')
		.controller('player_controller', ['$scope', '$interval', 'chrome_service', function($scope, $interval, chrome) {
			$scope.track = {
				image: '/popup/images/track_empty.jpg',
				title: null
			};

			$scope.track_status = {
				state: 'stop',
				duration: {
					current: 0,
					total: 0
				}
			};

			$scope.volume = {
				level: 80,
				muted: false
			};

			$scope.transform_time = function(time) {
				// get hours
				var hours = Math.floor(time / (60*60));
				var minutes = Math.floor((time % (60*60))/60);
				var seconds = Math.floor(time % 60);

				if (minutes < 10) {
					minutes = '0'+minutes;
				}

				if (seconds < 10) {
					seconds = '0'+seconds;
				}

				return hours+':'+minutes+':'+seconds;
			};

			$scope.seek = function(value) {
				chrome.query(chrome.type_track_player, 'seek', value);
			};

			$scope.play_prev = function() {
				chrome.query(chrome.type_playlist, 'play_prev', function() {
					refresh();
				});
			};

			$scope.play = function() {
				chrome.query(chrome.type_playlist, 'play', function() {
					refresh();
				});
			};

			$scope.pause = function() {
				chrome.query(chrome.type_track_player, 'pause', function() {
					refresh();
				});
			};

			$scope.play_next = function() {
				chrome.query(chrome.type_playlist, 'play_next', function() {
					refresh();
				});
			};

			var status_interval;

			var refresh = function() {
				chrome.query(chrome.type_playlist, 'track', function(track) {
					$scope.$apply(function() {
						$scope.track = track;
					});

					if (status_interval) {
						$interval.cancel(status_interval);
					}

					status_interval = $interval(function() {
						chrome.query(chrome.type_track_player, 'track_state', function(status) {
							$scope.$apply(function() {
								$scope.track_status.state = status.state;
								$scope.track_status.duration = status.duration;
								$scope.volume = status.volume;
							});
						});
					}, 300);
				});
			};

			refresh();
		}])
		.directive('playerControl', [function() {
			return {
				restrict: 'A',
				templateUrl: '/popup/templates/player.html',
				link: function($scope, element, attrs) {
					var seekbar = $(element).find('.seekbar').slider({
						range: 'min',
						min: 0,
						change: function(event, ui) {
							if (event.originalEvent) {
								$scope.seek(ui.value);
							}
						}
					});

					$scope.$watch('track_status.duration', function() {
						seekbar.slider('option', 'max', $scope.track_status.duration.total);
						seekbar.slider('option', 'value', $scope.track_status.duration.current);
					});
				}
			};
		}]);
});