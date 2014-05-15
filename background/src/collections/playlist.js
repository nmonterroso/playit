define(['backbone', 'localstorage', 'playlist'], function(Backbone, localstorage, playlist) {
	'use strict';

	return Backbone.Collection.extend({
		constructor: function() {
			Backbone.Collection.apply(this, arguments);
		},
		model: playlist,
		localStorage: new localstorage('Playlists')
	});
});