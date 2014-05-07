define(
	[
		'underscore',
		'backbone',
		'tracks/mixing.dj'
	],
	function(_, Backbone, mixing_dj) {
		'use strict';

		var track = Backbone.Model.extend({}, {
			factory: function(url) {
				var detected_type = _.find([mixing_dj], function(track_type) {
					return track_type.can_play(url);
				});

				if (!detected_type) {
					console.error("unable to determine track type", url);
					return null;
				}

				return new detected_type({url: url});
			}
		});

		return track.factory;
	}
);