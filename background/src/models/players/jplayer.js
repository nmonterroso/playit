define(
	[
		'jquery',
		'players/abstract',
		'jquery.jplayer'
	],
	function($, abstract_player) {
		'use strict';

		var default_volume = .8;
		var convert_volume = function(level) {
			return level / 100;
		};

		abstract_player.dispatcher.on(abstract_player.event_types.set_volume, function(level) {
			default_volume = convert_volume(level);
		});

		return abstract_player.extend({}, {
			play: function(url) {
				var self = this;

				var cb = function() {
					if (self.player.data('jPlayer').status.src != url || self.current_player_state == self.player_state.stop) {
						self.player.jPlayer('setMedia', { mp3: url });
					}

					self.resume();
				};

				if (this.player == null) {
					$('#jplayer').jPlayer({
						ready: function() {
							self.player = $(this);
							cb();
						},
						volume: default_volume,
						swfPath: '/background/src/vendor/Jplayer.swf',
						ended: function(){
							abstract_player.dispatcher.trigger(abstract_player.event_types.playback_complete);
						}
					});
				} else {
					cb();
				}
			},
			pause: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.pause;
				this.player.jPlayer('pause');
			},
			resume: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.play;
				this.player.jPlayer('play');
			},
			stop: function() {
				if (this.player == null) {
					return;
				}

				this.current_player_state = this.player_state.stop;
				this.player.jPlayer('stop');
				this.player.jPlayer('destroy');
				this.player = null;
			},
			seek: function(time) {
				if (this.player == null) {
					return;
				}

				this.player.jPlayer('play', time);
			},
			volume: function(level) {
				if (this.player == null) {
					return;
				}

				this.player.jPlayer('volume', convert_volume(level));
			},
			mute: function() {
				if (this.player == null) {
					return;
				}

				this.player.jPlayer('mute');
			},
			unmute: function() {
				if (this.player == null) {
					return;
				}

				this.player.jPlayer('unmute');
			},
			track_state: function() {
				if (this.player == null) {
					return abstract_player.default_state;
				}

				var status = this.player.data('jPlayer').status;
				return {
					state: this.current_player_state,
					duration: {
						current: abstract_player.format_time(status.currentTime),
						total: abstract_player.format_time(status.duration)
					},
					volume: {
						level: this.player.jPlayer('option', 'volume')*100,
						muted: this.player.jPlayer('option', 'muted')
					}
				}
			}
		});
	}
);