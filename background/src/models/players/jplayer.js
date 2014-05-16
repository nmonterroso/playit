define(['jquery', 'players/abstract', 'jquery.jplayer'], function($, abstract_player) {
	'use strict';

	return abstract_player.extend({}, {
		play: function(url) {
			var self = this;

			var cb = function() {
				if (self.player.data('jPlayer').status.src != url) {
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

			this.player.jPlayer('volume', level);
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
					current: status.currentTime,
					total: status.duration
				},
				volume: {
					level: this.player.jPlayer('option', 'volume')*100,
					muted: this.player.jPlayer('option', 'muted')
				}
			}
		}
	});
});