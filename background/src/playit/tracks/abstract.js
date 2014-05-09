define(['underscore', 'backbone'], function(_, Backbone) {
	'use strict';

	var abstract_track = Backbone.Model.extend({
		defaults: {
			ready: false,
			source_url: null,
			play_url: null,
			unplayable: false
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
		play: function() {
			this.ready(function(self) {
				var player;

				switch (self.play_type()) {
					case abstract_track.play_type_jplayer:
						console.log('playing in jplayer', self.source_url());
						break;
					case abstract_track.play_type_youtube:
						console.log('playing in youtube', self.source_url());
						break;
				}
			});
		},
		play_type: function() {
			return abstract_track.play_type_jplayer;
		},

		// abstract methods
		prepare: function() {
			abstract_track.unimplemented('prepare');
		},
		start: function() {
			abstract_track.unimplemented('start');
		}
	}, {
		play_type_jplayer: 'jplayer',
		play_type_youtube: 'youtube',
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