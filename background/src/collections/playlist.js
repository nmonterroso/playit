define(
	[
		'backbone',
		'localstorage',
		'collections/abstract',
		'playlist'
	],
	function(Backbone, localstorage, abstract_collection, playlist) {
		'use strict';

		var collection = new (abstract_collection.extend({
			model: playlist,
			localStorage: new localstorage('playlists'),
			create_playlist: function(name) {
				var playlist = this.create({
					name: name
				});

				this.bind_change(playlist);
				return playlist;
			}
		}))();

		collection.fetch();
		collection.bind_change();
		return collection;
	}
);