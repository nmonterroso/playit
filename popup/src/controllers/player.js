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
					current: '0:00:00',
					total: '0:00:00'
				}
			};

			$scope.volume = {
				level: 80,
				muted: false
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
				$scope.track_status.state = 'play';
				chrome.query(chrome.type_playlist, 'play', function() {
					refresh();
				});
			};

			$scope.pause = function() {
				$scope.track_status.state = 'pause';
				chrome.query(chrome.type_track_player, 'pause', function() {
					refresh();
				});
			};

			$scope.stop = function() {
				$scope.track_status.state = 'stop';
				chrome.query(chrome.type_track_player, 'stop', function() {
					refresh();
				});
			};

			$scope.play_next = function() {
				chrome.query(chrome.type_playlist, 'play_next', function() {
					refresh();
				});
			};

			$scope.set_volume = function(level) {
				chrome.query(chrome.type_playit, 'set_volume', level, function() {
					refresh();
				});
			};

			$scope.mute = function() {
				$scope.volume.muted = true;
				chrome.query(chrome.type_track_player, 'mute', function() {
					refresh();
				});
			};

			$scope.unmute = function() {
				$scope.volume.muted = false;
				chrome.query(chrome.type_track_player, 'unmute', function() {
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

					var volume_slider = $(element).find('.volume_slider').slider({
						orientation: 'vertical',
						range: 'min',
						min: 0,
						max: 100,
						value: $scope.volume.level,
						change: function(event, ui) {
							if (event.originalEvent) {
								$scope.set_volume(ui.value);
							}
						}
					});

					var volume_slider_container = $(element).find('.volume_slider_container').hide();
					$(element).find('.volume_control > img').click(function() {
						volume_slider_container.slideToggle(75);
					});

					$scope.$watch('track_status.duration', function() {
						seekbar.slider('option', 'max', $scope.track_status.duration.total);
						seekbar.slider('option', 'value', $scope.track_status.duration.current);
					});

					$scope.$watch('volume', function() {
						volume_slider.slider('option', 'value', $scope.volume.level);
					});
				}
			};
		}]);
});