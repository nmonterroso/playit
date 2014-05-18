define(['backbone', 'underscore', 'jquery', 'jquery.jplayer'], function(Backbone, _, $) {
	'use strict';

	$.jPlayer.timeFormat.showHour = true;

	return Backbone.Model.extend({}, {
		player: null,
		current_player_state: 'stop',
		dispatcher: _.clone(Backbone.Events),
		event_types: {
			playback_complete: 'playback_complete',
			set_volume: 'set_volume'
		},
		default_state: {
			state: 'stop',
			duration: {
				current: '0:00:00',
				total: '0:00:00'
			},
			volume: {
				level: 80,
				muted: false
			}
		},
		player_state: {
			play: 'play',
			pause: 'pause',
			stop: 'stop'
		},
		format_time: function(time) {
			return $.jPlayer.convertTime(time);
		},
		unimplemented: function(method) {
			console.error('unimplemented method', method);
			throw '';
		},
		play: function(url) {
			this.unimplemented('play');
		},
		pause: function() {
			this.unimplemented('pause');
		},
		resume: function() {
			this.unimplemented('resume');
		},
		stop: function() {
			this.unimplemented('stop');
		},
		seek: function(time) {
			this.unimplemented('seek');
		},
		volume: function(level) {
			this.unimplemented('volume');
		},
		mute: function() {
			this.unimplemented('mute');
		},
		unmute: function() {
			this.unimplemented('unmute');
		},
		track_state: function() {
			this.unimplemented('unmute');
		}
	});
});