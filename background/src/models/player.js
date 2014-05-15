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
				current_playlist: 0,
				id: 'main'
			},
			localStorage: new localstorage('player'),
			playlists: playlist_collection,
			initialize: function() {
				this.fetch();

				if (this.playlists.size() == 0) {
					this.playlists.create_playlist('Default');
					this.localStorage.create(this);
				}

				this.on('change', function(player) {
					this.sync('update', player);
				}, this);

				abstract_track.dispatcher.on(abstract_track.event_types.playback_complete, this.play_next, this);
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
			play_at: function(index) {
				this.playlist().play_at(index);
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