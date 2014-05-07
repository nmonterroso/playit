define(['tracks/abstract'], function(abstract_track) {
	'use strict';

	return abstract_track.extend({
		prepare: function() {
			this.dispatcher.trigger(abstract_track.event_types.ready, this);
		}
	}, {
		can_play: function(url) {
			return url.match(/^http:\/\/mixing\.dj\/([0-9]+)\/livesets/) != null;
		}
	});
});