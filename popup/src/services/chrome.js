define(['angular'], function(ng) {
	ng.module('playit.services')
		.factory('chrome_service', ['$rootScope', '$q', function($rootScope, $q) {
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

			this.type_playit = 'playit';
			this.type_playlist = 'playlist';
			this.type_track = 'track';
			this.type_track_player = 'track_player';

			this.query = function() {
				var deferred = $q.defer();

				var guid = this.generate_guid();
				var type = arguments[0];
				var func = arguments[1];
				var args = _.rest(arguments, 2);

				var proxy = function(message) {
					if (message.id == guid) {
						deferred.resolve(message.body);
						port.onMessage.removeListener(proxy);
					}
				};
				port.onMessage.addListener(proxy);

				port.postMessage({
					id: guid,
					type: type,
					func: func,
					args: args
				});

				return deferred.promise;
			};

			return this;
		}]);
});