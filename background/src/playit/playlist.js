define(['underscore', 'backbone', 'track_factory'], function(_, Backbone, track_factory) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			list: [],
			current_track: 0
		},
		list: function() {
			return this.get('list');
		},
		current: function() {
			return this.get('current_track');
		},
		add: function(url, next) {
			var track = track_factory(url);

			if (track != null) {
				if (next) {
					this.list().splice(1, 0, track);
				} else {
					this.list().push(track);
				}

				if (this.list().length == 1) {
					this.play();
				}
			}
		},
		clear: function() {
			this.set({list: []});
		},
		play: function() {
			this.list()[this.current()].play();
		},
		play_next: function() {
			this.set({current_track: this.current() + 1});
			this.play();
		},
		play_prev: function() {
			this.set({current_track: this.current() - 1});
			this.play();
		}
	});
});