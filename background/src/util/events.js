define(['backbone', 'underscore'], function(Backbone, _) {
	'use strict';

	return new (Backbone.Model.extend({
		dispatcher: _.clone(Backbone.Events),
		event_types: {
			set_volume: 'set_volume',
			playback: {
				complete: 'playback_complete',
				failed: 'playback_failed'
			},
			track: {
				ready: 'track_ready',
				unplayable: 'track_unplayable',
				change: 'track_change'
			}
		}
	}))();
});