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
				var new_playlist = this.create({
					name: name
				});

				this.bind_change(new_playlist);
				return new_playlist;
			}
		}))();

		collection.fetch();
		collection.bind_change();
		return collection;
	}
);