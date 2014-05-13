define(['backbone', 'playlist', 'tracks/abstract'], function(Backbone, playlist, abstract_track) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			current_playlist: 0,
			playlists: [new playlist({name: 'Default'})]
		},
		initialize: function() {
			abstract_track.dispatcher.on(abstract_track.event_types.playback_complete, this.play_next, this);
		},
		playlist: function() {
			return this.get('playlists')[this.get('current_playlist')];
		},
		clear: function() {
			this.playlist().clear();
		},
		play: function(url, next, clear) {
			if (clear) {
				this.clear();
			}

			this.playlist().add(url, next);
		},
		play_next: function() {
			this.playlist().play_next();
		},
		play_prev: function() {
			this.playlist().play_prev();
		}
	});
});