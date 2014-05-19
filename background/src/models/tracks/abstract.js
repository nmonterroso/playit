define(['underscore', 'backbone', 'events', 'players/jplayer', 'players/ytplayer'], function(_, Backbone, events, jplayer, ytplayer) {
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
			this.preparing = false;
			events.dispatcher.on(events.event_types.playback.failed, this.on_playback_failed, this);
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

			events.dispatcher.once(events.event_types.track.ready+this.id, callback);

			if (!this.preparing) {
				this.preparing = true;
				this.prepare();
			}
		},
		set_ready: function(play_url, title, image) {
			this.set({
				play_url: play_url,
				ready: true,
				title: title || null,
				image: image || null
			});
			events.dispatcher.trigger(events.event_types.track.ready+this.id, this);
		},
		player: function() {
			var player = null;

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
			events.dispatcher.trigger(events.event_types.track.unplayable, this);
		},
		on_playback_failed: function(url, play_type, error) {
			if (url != this.play_url() || play_type != this.play_type()) {
				return;
			}

			this.playback_failed(error);
		},

		// abstract methods
		prepare: function() {
			abstract_track.unimplemented('prepare');
		},
		start: function() {
			abstract_track.unimplemented('start');
		},
		playback_failed: function(error) {
			abstract_track.unimplemented('playback_failed');
		}
	}, {
		play_type_jplayer: 'jplayer',
		play_type_youtube: 'youtube',
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