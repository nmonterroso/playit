define(
	[
		'underscore',
		'backbone',
		'localstorage',
		'tracks/mixing.dj',
		'tracks/zippyshare.com',
	],
	function(_, Backbone, localstorage, mixing_dj, zippyshare) {
		'use strict';

		return Backbone.Collection.extend({
			constructor: function() {
				this.playlist_id = arguments[0];
				Backbone.Collection.apply(this, _.rest(arguments));
			},
			initialize: function() {
				this.localStorage = new localstorage('Tracks-'+this.playlist_id);
				this.on('remove', this._remove, this);
				this.on('change', this._save, this);
			},
			model: function(attrs, options) {
				if (!attrs.source_url) {
					throw "missing source url";
				}

				var detected_type = _.find([mixing_dj, zippyshare], function(track_type) {
					return track_type.can_play(attrs.source_url);
				});

				if (!detected_type) {
					throw "unable to determine track type"+attrs.source_url;
				}

				var track = new detected_type(attrs, options);

				track.on('change', function(track) {
					track.collection.sync('update', track);
				});
				return track;
			},
			_remove: function(track) {
				this.localStorage.destroy(track);
			},
			_save: function() {
				this.localStorage.save();
			}
		});
	}
);