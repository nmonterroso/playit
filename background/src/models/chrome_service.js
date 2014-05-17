define(['backbone'], function(Backbone) {
	'use strict';

	return new (Backbone.Model.extend({
		initialize: function() {
			this.playit = null;
			this.port = null;
		},
		set_playit: function(playit) {
			this.playit = playit;
		},
		set_port: function(port) {
			this.port = port;
			var playit = this.playit;

			port.onMessage.addListener(function(message) {
				var actor;

				switch (message.type) {
					case 'playlist':
						actor = playit.playlist();
						break;
					case 'track':
						actor = playit.playlist().track();
						break;
					case 'track_player':
						var track = playit.playlist().track();
						actor = track == null ? null : track.player();
						break;
					default:
						actor = playit;
						break;
				}

				var response = actor == null ? null : actor[message.func].apply(actor, message.args);

				port.postMessage({
					id: message.id || 0,
					type: message.type+'-'+message.func,
					body: response
				});
			});
		}
	}))();
});