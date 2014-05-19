define(['backbone', 'events'], function(Backbone, events) {
	'use strict';

	return new (Backbone.Model.extend({
		initialize: function() {
			this.playit = null;
			this.port = null;
			events.dispatcher.on(events.event_types.track.change, this.on_track_change, this);
		},
		set_playit: function(playit) {
			this.playit = playit;
		},
		set_port: function(port) {
			this.port = port;
			var playit = this.playit;
			var self = this;

			this.port.onMessage.addListener(function(message) {
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

				self.post_message(message.id || 0, response);
			});

			self.port.onDisconnect.addListener(function() {
				self.port = null;
			});
		},
		post_message: function(id, body, type) {
			var message = {
				body: body
			};

			if (id != null) {
				message.id = id;
			}

			if (type != null) {
				message.type = type;
			}

			if (this.port != null) {
				this.port.postMessage(message);
			}
		},
		on_track_change: function(current_track_id) {
			this.post_message(null, current_track_id, 'track_change');
		}
	}))();
});