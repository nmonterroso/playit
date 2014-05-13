define(
	[
		'underscore',
		'tracks/mixing.dj',
		'tracks/zippyshare.com',
	],
	function(_, mixing_dj, zippyshare) {
		'use strict';

		return function(url) {
			var detected_type = _.find([mixing_dj, zippyshare], function(track_type) {
				return track_type.can_play(url);
			});

			if (!detected_type) {
				console.error("unable to determine track type", url);
				return null;
			}

			return new detected_type({source_url: url});
		};
	}
);