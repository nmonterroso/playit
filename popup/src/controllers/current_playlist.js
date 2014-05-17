define(['angular', 'underscore', 'jquery'], function(ng, _, $) {
	'use strict';

	ng.module('playit.controllers')
		.controller('current_playlist_controller', [
			'$scope', '$rootScope', '$interval', 'chrome_service',
			function($scope, $rootScope, $interval, chrome) {
				var status_interval;

				var refresh_list = function() {
					chrome.query(chrome.type_playlist, 'details', function(playlist) {
						$scope.$apply(function() {
							$scope.playlist = playlist;
							$scope.ready = true;
						});

						refresh_track();
					});
				};

				var refresh_track = function() {
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
				};

				$scope.ready = false;

				$scope.playlist = {
					current_track: '-1',
					track_list: [{
						id: '-1',
						image: '/popup/images/track_empty.jpg',
						title: 'Loading...'
					}]
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

				$scope.play = function() {
					$scope.track_status.state = 'play';
					chrome.query(chrome.type_playlist, 'play');
				};

				$scope.play_track = function(track_id) {
					if (track_id == $scope.playlist.current_track) {
						return;
					}

					$scope.playlist.current_track = track_id;
					chrome.query(chrome.type_playlist, 'play_at', track_id);
				};

				$scope.pause = function() {
					$scope.track_status.state = 'pause';
					chrome.query(chrome.type_track_player, 'pause');
				};

				$scope.stop = function() {
					$scope.track_status.state = 'stop';
					chrome.query(chrome.type_track_player, 'stop');
				};

				$scope.set_volume = function(level) {
					chrome.query(chrome.type_playit, 'set_volume', level);
				};

				$scope.mute = function() {
					$scope.volume.muted = true;
					chrome.query(chrome.type_track_player, 'mute');
				};

				$scope.unmute = function() {
					$scope.volume.muted = false;
					chrome.query(chrome.type_track_player, 'unmute');
				};

				refresh_list();
			}
		])
		.directive('currentPlaylist', [function() {
			return {
				restrict: 'A',
				templateUrl: '/popup/templates/current_playlist.html',
				link: function($scope, element, attrs) {
					$scope.$watch('ready', function() {
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

						$scope.$watch('track_status.duration', function() {
							seekbar.slider('option', 'max', $scope.track_status.duration.total);
							seekbar.slider('option', 'value', $scope.track_status.duration.current);
						});

						$scope.$watch('volume', function() {
							volume_slider.slider('option', 'value', $scope.volume.level);
						});
					});
				}
			}
		}]);
});