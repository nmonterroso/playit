define(['underscore', 'backbone', 'track_factory'], function(_, Backbone, track_factory) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			list: []
		},
		list: function() {
			return this.get('list');
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
					track.play();
				}
			}
		},
		clear: function() {
			this.set({list: []});
		}
	});
});