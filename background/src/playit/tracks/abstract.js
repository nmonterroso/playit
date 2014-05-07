define(['underscore', 'backbone'], function(_, Backbone) {
	'use strict';

	var abstract_track = Backbone.Model.extend({
		initialize: function() {
			this.set({
				ready: false,
			});

			this.dispatcher = _.clone(Backbone.Events);
			this.preparing = false;
			this.on_ready(function(track) {}); // kick it
		},
		url: function() {
			return this.get('url');
		},
		on_ready: function(callback) {
			if (this.get('ready')) {
				callback(this);
				return;
			}

			this.dispatcher.on(abstract_track.event_types.ready, callback);

			if (!this.preparing) {
				this.preparing = true;
				this.prepare();
			}
		},

		// abstract methods
		prepare: function() {
			abstract_track.unimplemented('prepare');
		}
	}, {
		event_types: {
			ready: 'ready'
		},
		unimplemented: function(method) {
			console.error('unimplemented method:', method);
		},
		can_play: function(url) {
			return false;
		}
	});

	return abstract_track;
});