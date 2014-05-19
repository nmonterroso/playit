define(
	[
		'underscore',
		'backbone',
		'localstorage',
		'collections/abstract',
		'tracks/mixing.dj',
		'tracks/zippyshare.com',
		'tracks/youtube.com',
	],
	function(_, Backbone, localstorage, abstract_collection, mixing_dj, zippyshare, youtube) {
		'use strict';

		var collection = new (abstract_collection.extend({
			localStorage: new localstorage('tracks'),
			initialize: function() {
				this.on('remove', function(track) {
					this.sync('delete', track);
				}, this);
			},
			model: function(attrs, options) {
				if (!attrs.source_url) {
					throw "missing source url";
				}

				var detected_type = _.find([mixing_dj, zippyshare, youtube], function(track_type) {
					return track_type.can_play(attrs.source_url);
				});

				if (!detected_type) {
					throw "unable to determine track type"+attrs.source_url;
				}

				return new detected_type(attrs, options);
			},
			create_track: function(source_url) {
				var track = this.findWhere({ source_url: source_url });

				if (!track) {
					try {
						track = this.create({ source_url: source_url })
					} catch (e) {
						console.error(e);
						return null;
					}
				}

				this.bind_change(track);
				return track;
			}
		}))();

		collection.fetch();
		collection.bind_change();
		return collection;
	}
);