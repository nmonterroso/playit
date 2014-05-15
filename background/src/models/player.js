define(
	[
		'backbone',
		'localstorage',
		'collections/playlist',
		'tracks/abstract'
	],
	function(Backbone, localstorage, playlist_collection, abstract_track) {
		'use strict';

		return Backbone.Model.extend({
			defaults: {
				current_playlist: 0
			},
			localStorage: new localstorage('player_state'),
			initialize: function() {
				this.fetch();

				this.playlists = new playlist_collection();
				this.playlists.fetch();
				if (this.playlists.size() == 0) {
					this.create_playlist('Default');
				}

				abstract_track.dispatcher.on(abstract_track.event_types.playback_complete, this.play_next, this);
			},
			create_playlist: function(name) {
				this.playlists.create({
					name: name
				})
			},
			playlist: function() {
				return this.playlists.at(this.get('current_playlist'));
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
	}
);