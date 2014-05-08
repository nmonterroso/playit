define(['underscore', 'backbone'], function(_, Backbone) {
	'use strict';

	var abstract_track = Backbone.Model.extend({
		defaults: {
			ready: false,
			source_url: null,
			play_url: null
		},
		initialize: function() {
			this.dispatcher = _.clone(Backbone.Events);
			this.preparing = false;
			this.ready(function(track) {}); // kick it
		},
		source_url: function() {
			return this.get('source_url');
		},
		play_url: function() {
			return this.get('play_url');
		},
		ready: function(callback) {
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
		},
		play: function() {
			abstract_track.unimplemented('play');
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