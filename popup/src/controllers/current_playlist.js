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
						var seekbar = $(element).find('.seekbar').slider({
							range: 'min',
							min: 0,
							change: function(event, ui) {
								if (event.originalEvent) {
									$scope.seek(ui.value);
								}
							},
							start: function() {
								seekbar.data('seekbar_active', true);
							},
							stop: function() {
								seekbar.data('seekbar_active', false);
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

						var scroll_track_title = function(track_id) {
							var track_title = $('#track-'+track_id).find('.track_title');
							var title = track_title.find('.track_title_text');
							var container_width = track_title.width();
							var title_width = title.width();

							if (title_width > container_width) {
								var helper =
									track_title
										.find('.track_title_text_scroll_helper')
										.css({ left: container_width })
										.text(title.text());
								var duration = title_width*10;
								var initial_distance = title_width-(container_width * .75);
								var secondary_duration = (title_width-initial_distance)*(duration/initial_distance);
								var helper_duration = container_width*((duration+secondary_duration)/title_width);

								title.stop().animate({ left: -initial_distance }, duration, 'linear', function() {
									title.animate({ left: -title_width }, secondary_duration, 'linear');
									helper.animate({ left: 0 }, helper_duration, 'linear', function() {
										title.css({ left: 0 });
										scroll_track_title(track_id);
									});
								});
							}
						};

						var clear_track_title_scroll = function(track_id) {
							var track_title = $('#track-'+track_id).find('.track_title');
							track_title
								.find('.track_title_text')
									.stop()
									.animate({ left: 0 }, 200)
								.end()
								.find('.track_title_text_scroll_helper')
									.stop()
									.text('');
						};

						$(element).find('.track_title').hover(
							function() { // in
								var track_id = $(this).closest('.track').attr('id').split('track-')[1];
								if (track_id != $scope.playlist.current_track) {
									scroll_track_title(track_id);
								}
							}, function() { // out
								var track_id = $(this).closest('.track').attr('id').split('track-')[1];
								if (track_id != $scope.playlist.current_track) {
									clear_track_title_scroll(track_id);
								}

							}
						);

						$scope.$watch('track_status.duration', function() {
							if (!seekbar.data('seekbar_active')) {
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

							_.each($scope.playlist.track_list, function(track) {
								clear_track_title_scroll(track.id)
							});

							setTimeout(function() {
								scroll_track_title($scope.playlist.current_track);
							}, 1000);
						});
					});
				}
			}
		}]);
});