define(['backbone', 'playlist'], function(Backbone, playlist) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			current_playlist: 0,
			playlists: [new playlist({name: 'Default'})]
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

			this.playlist().add(url);
		}
	});
});