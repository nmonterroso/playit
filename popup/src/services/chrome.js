define(['angular'], function(ng) {
	ng.module('playit.services')
		.factory('chrome_service', ['$rootScope', function($rootScope) {
			var port = chrome.runtime.connect({ name: 'popup' });
			port.onMessage.addListener(function(message) {
				if (!message.id) {
					$rootScope.$emit(message.type, message.body);
				}
			});

			this.generate_guid = function() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}

				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			};

			this.type_player = 'player';
			this.type_playlist = 'playlist';
			this.type_track = 'track';
			this.type_track_player = 'track_player';

			this.query = function() {
				var guid = this.generate_guid();
				var type = arguments[0];
				var func = arguments[1];
				var args = _.rest(arguments, 2);

				var cb = null;
				if (args.length > 0 && typeof args[args.length - 1] == 'function') {
					cb = args[args.length-1];
					args = _.initial(args, 1);
				}

				if (cb !== null) {
					var proxy = function(message) {
						if (message.id == guid) {
							cb(message.body);
							port.onMessage.removeListener(proxy);
						}
					};
					port.onMessage.addListener(proxy);
				}

				port.postMessage({
					id: guid,
					type: type,
					func: func,
					args: args
				});
			};

			return this;
		}]);
});