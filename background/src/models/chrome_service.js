define(['backbone'], function(Backbone) {
	'use strict';

	return new (Backbone.Model.extend({
		initialize: function() {
			this.player = null;
			this.port = null;
		},
		set_player: function(player) {
			this.player = player;
		},
		set_port: function(port) {
			this.port = port;
			var player = this.player;

			port.onMessage.addListener(function(message) {
				var actor;

				switch (message.type) {
					case 'playlist':
						actor = player.playlist();
						break;
					case 'track':
						actor = player.playlist().track();
						break;
					default:
						actor = player;
						break;
				}

				var response = actor[message.func].apply(actor, message.args);
				port.postMessage({
					id: message.id || 0,
					type: message.type+'-'+message.func,
					body: response
				});
			});
		}
	}))();
});