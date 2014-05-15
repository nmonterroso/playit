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
				this.on('remove', function(track) {
					this.sync('delete', track);
				}, this);
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

				return new detected_type(attrs, options);
			}
		});
	}
);