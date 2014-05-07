define(['underscore', 'backbone', 'track_factory'], function(_, Backbone, track_factory) {
	'use strict';

	return Backbone.Model.extend({
		initialize: function() {
			this.set({
				list: []
			});
		},
		list: function() {
			return this.get('list');
		},
		add: function(url) {
			var track = track_factory(url);

			if (track != null) {
				this.list().push(track);
			}
		},
		clear: function() {
			this.set({list: []});
		}
	});
});