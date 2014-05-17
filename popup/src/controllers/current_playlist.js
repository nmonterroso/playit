define(['angular', 'underscore', 'jquery', 'jquery-ui', 'jquery-scrollTo'], function(ng, _, $) {
	'use strict';

	ng.module('playit.controllers')
		.controller('current_playlist_controller', [
			'$scope', '$rootScope', '$interval', 'chrome_service',
			function($scope, $rootScope, $interval, chrome) {
				var status_interval;

				var track_state = {
					play: 'play',
					pause: 'pause',
					stop: 'stop'
				};

				var refresh_list = function() {
					chrome.query(chrome.type_playlist, 'details')
						.then(function(playlist) {
							$scope.playlist = playlist;
							$scope.ready = true;

							refresh_track(true);
						});
				};

				var refresh_track = function(apply_volume) {
					apply_volume = apply_volume || false;
					if (status_interval) {
						$interval.cancel(status_interval);
					}

					status_interval = $interval(function() {
						if ($scope.playlist.current_track == null) {
							return;
						}

						chrome.query(chrome.type_track_player, 'track_state')
							.then(function(status) {
								if (status == null) {
									return;
								}

								$scope.track_status.state = status.state;
								$scope.track_status.duration = status.duration;

								if (apply_volume) {
									$scope.volume = status.volume;
									apply_volume = false;
								}
							});
					}, 300);
				};

				$scope.ready = false;

				$scope.playlist = {
					current_track: null,
					track_list: [{
						id: null,
						image: '/popup/images/track_empty.jpg',
						title: 'Loading...'
					}]
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

				$scope.seek = function(value) {
					return chrome.query(chrome.type_track_player, 'seek', value);
				};

				$scope.play = function() {
					$scope.track_status.state = track_state.play;
					return chrome.query(chrome.type_playlist, 'play');
				};

				$scope.play_track = function(track_id) {
					if (track_id == $scope.playlist.current_track && $scope.track_status.state == 'play') {
						return;
					}

					$scope.playlist.current_track = track_id;

					return $scope.stop()
						.then(function() {
							return chrome.query(chrome.type_playlist, 'play_at', track_id);
						});
				};

				$scope.pause = function() {
					$scope.track_status.state =  track_state.pause;
					return chrome.query(chrome.type_track_player, 'pause');
				};

				$scope.stop = function() {
					$scope.track_status.state =  track_state.stop;
					return chrome.query(chrome.type_track_player, 'stop');
				};

				$scope.set_volume = function(level) {
					return chrome.query(chrome.type_playit, 'set_volume', level);
				};

				$scope.mute = function() {
					$scope.volume.muted = true;
					return chrome.query(chrome.type_track_player, 'mute');
				};

				$scope.unmute = function() {
					$scope.volume.muted = false;
					return chrome.query(chrome.type_track_player, 'unmute');
				};

				$scope.remove = function(track_id) {
					var remove = function() {
						return chrome.query(chrome.type_playlist, 'remove', track_id);
					};

					if (track_id == $scope.playlist.current_track) {
						if ($scope.track_status.state == track_state.play) {
							chrome.query(chrome.type_playlist, 'play_next')
								.then(function(next_track_id) {
									if (next_track_id == null) {
										$scope.stop().then(remove);
									} else {
										remove();
									}

									$scope.playlist.current_track = next_track_id;
								});
						} else {
							chrome.query(chrome.type_playlist, 'get_next_id')
								.then(function(next_track_id) {
									remove();
									$scope.playlist.current_track = next_track_id;
								});
						}
					} else {
						remove();
					}

					$scope.playlist.track_list = _.without($scope.playlist.track_list, _.find($scope.playlist.track_list, function(track) {
						return track.id == track_id;
					}));
				};

				$scope.transform_time = function(time) {
					// get hours
					var hours = Math.floor(time / (60*60));
					var minutes = Math.floor((time % (60*60))/60);
					var seconds = Math.floor(time % 60);
					var time_display = [];

					if (hours > 0) {
						time_display.push(hours);
					}

					if (minutes < 10) {
						minutes = '0'+minutes;
					}

					if (seconds < 10) {
						seconds = '0'+seconds;
					}

					time_display.push(minutes, seconds);

					return time_display.join(':');
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
						var seekbar_active = false;

						var seekbar = $(element).find('.seekbar').slider({
							range: 'min',
							min: 0,
							change: function(event, ui) {
								if (event.originalEvent) {
									$scope.seek(ui.value);
								}
							},
							start: function() {
								seekbar_active = true;
							},
							stop: function() {
								seekbar_active = false;
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
							if (!seekbar_active) {
								seekbar.slider('option', 'max', $scope.track_status.duration.total);
								seekbar.slider('option', 'value', $scope.track_status.duration.current);
							}
						});

						$scope.$watch('volume', function() {
							volume_slider.slider('option', 'value', $scope.volume.level);
						});

						$scope.$watch('playlist.current_track', function() {
							$.scrollTo('#track-'+$scope.playlist.current_track, {
								duration: 200
							});
						});
					});
				}
			}
		}]);
});