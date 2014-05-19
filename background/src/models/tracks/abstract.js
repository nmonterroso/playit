define(['underscore', 'backbone', 'players/jplayer', 'players/ytplayer'], function(_, Backbone, jplayer, ytplayer) {
	'use strict';

	var abstract_track = Backbone.Model.extend({
		defaults: {
			ready: false,
			source_url: null,
			play_url: null,
			unplayable: false,
			image: null,
			title: null
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
		player: function() {
			var player;

			switch (this.play_type()) {
				case abstract_track.play_type_jplayer:
					player = jplayer;
					break;
				case abstract_track.play_type_youtube:
					player = ytplayer;
					break;
			}

			return player;
		},
		play: function() {
			this.ready(function(self) {
				self.player().play(self.play_url());
			});
		},
		play_type: function() {
			return abstract_track.play_type_jplayer;
		},
		unplayable: function() {
			console.error("unable to play track from "+this.source_url());
			this.set('unplayable', true);
			this.collection.dispatcher.trigger(abstract_track.event_types.unplayable, this);
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
			ready: 'ready',
			unplayable: 'unplayable'
		},
		unimplemented: function(method) {
			console.error('unimplemented method:', method);
			throw '';
		},
		can_play: function(url) {
			return false;
		}
	});

	return abstract_track;
});