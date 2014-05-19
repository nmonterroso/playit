define(
	[
		'jquery',
		'players/abstract',
		'events'
	],
	function($, abstract_player, events) {
		'use strict';

		var default_volume = 80;

		events.dispatcher.on(events.event_types.set_volume, function(level) {
			default_volume = level;
		});

		return abstract_player.extend({}, {
			is_player_ready: false,
			curr_video_id: '',

			play: function(url) {
				var self = this;

				var cb = function() {
					if (self.curr_video_id != url || self.current_player_state == self.player_state.stop) {
						self.curr_video_id = url;
						self.player.cueVideoById(url); // url is the parsed ID
					}
					self.resume();
				};

				if (this.player == null) {
					// load api
					var tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

					// create yt player
					window.onYouTubePlayerAPIReady = function(playerId) {
						self.player = new YT.Player('ytplayer', {
							height: '390',
							width: '640',
							events: {
								'onReady': function(e) {
									self.is_player_ready = true;
									self.player.setPlaybackQuality("small");
									self.player.setVolume(default_volume);
									cb();
								},
								'onStateChange': function(e) {
									if (e.data == YT.PlayerState.ENDED) {
										self.current_player_state = self.player_state.stop;
										events.dispatcher.trigger(events.event_types.playback.complete);
									}
								}
							}
						});
						// must have this in order for the player to play
						var url = 'https://www.youtube.com/embed/?enablejsapi=1&origin=chrome-extension:\\\\aoaibjlahafamihchiamnnhhbhmkiiif';
						$('#ytplayer').attr('src', url);
					};
				} else {
					cb();
				}
			},
			pause: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.pause;
				this.player.pauseVideo();
			},
			resume: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.play;
				this.player.playVideo();
			},
			stop: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.stop;
				this.player.stopVideo();
				this.player.clearVideo();
			},
			seek: function(time) {
				if (this.player == null) {
					return;
				}

				this.player.seekTo(time, true);
			},
			volume: function(level) {
				if (this.player == null) {
					return;
				}

				this.player.setVolume(level);
			},
			mute: function() {
				if (this.player == null) {
					return;
				}

				this.player.mute();
			},
			unmute: function() {
				if (this.player == null) {
					return;
				}

				this.player.unMute();
			},
			track_state: function() {
				if (!this.is_player_ready) {
					return abstract_player.default_state;
				}

				return {
					state: this.current_player_state,
					duration: {
						current: this.player.getCurrentTime(),
						total: this.player.getDuration()
					},
					volume: {
						level: this.player.getVolume(),
						muted: this.player.isMuted()
					}
				}
			}
		});
	}
);