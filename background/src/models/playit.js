define(
	[
		'backbone',
		'localstorage',
		'events',
		'collections/playlist'
	],
	function(Backbone, localstorage, events, playlist_collection) {
		'use strict';

		return new (Backbone.Model.extend({
			defaults: {
				current_playlist: 0,
				volume: 80,
				id: 'main'
			},
			localStorage: new localstorage('playit'),
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

				events.dispatcher.on(events.event_types.playback.complete, this.play_next, this);
				events.dispatcher.trigger(events.event_types.set_volume, this.get('volume'));
			},
			set_volume: function(level) {
				this.set('volume', level);
				events.dispatcher.trigger(events.event_types.set_volume, this.get('volume'));
				this.playlist().track().player().volume(level);
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
		}))();
	}
);