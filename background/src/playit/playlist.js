define(['underscore', 'backbone', 'track_factory'], function(_, Backbone, track_factory) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			list: []
		},
		list: function() {
			return this.get('list');
		},
		add: function(url) {
			var track = track_factory(url);

			if (track != null) {
				this.list().push(track);
			}

			if (this.list().length == 1) {
				track.ready(function() {
					track.play();
				});
			}
		},
		clear: function() {
			this.set({list: []});
		}
	});
});