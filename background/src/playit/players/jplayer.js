define(['jquery', 'players/abstract', 'jquery.jplayer'], function($, abstract_player) {
	'use strict';

	return abstract_player.extend({}, {
		player: null,
		play: function(url) {
			var self = this;

			var cb = function() {
				self.player.jPlayer('setMedia', { mp3: url });
				self.resume();
			};

			if (this.player == null) {
				$('#player_jplayer').jPlayer({
					ready: function() {
						self.player = $(this);
						cb(url);
					},
					swfPath: '/background/src/vendor/Jplayer.swf'
				});
			} else {
				cb(url);
			}
		},
		pause: function() {
			this.player.jPlayer('pause');
		},
		resume: function() {
			this.player.jPlayer('play');
		},
		stop: function() {
			this.player.jPlayer('stop');
		},
		seek: function(time) {
			this.player.jPlayer('play', time);
		},
		volume: function(level) {
			this.player.jPlayer('volume', level);
		},
		mute: function() {
			this.player.jPlayer('mute');
		},
		unmute: function() {
			this.player.jPlayer('unmute');
		}
	});
});