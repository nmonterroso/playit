require.config({
	'paths': {
		// common
		'underscore': '/common/underscore-min',
		'jquery': '/common/jquery-2.1.1.min',

		'backbone': 'vendor/backbone',
		'localstorage': 'vendor/backbone.localStorage',
		'q': 'vendor/q',
		'swfobject': 'vendor/swfobject',

		// jquery deps
		'jquery.jplayer': 'vendor/jquery.jplayer.min',

		// core
		'playit': 'models/playit',
		'playlist': 'models/playlist',
		'chrome_service': 'models/chrome_service',
		'events': 'util/events',

		// collections
		'collections/abstract': 'collections/abstract',
		'collections/playlist': 'collections/playlist',
		'collections/track': 'collections/track',

		// tracks
		'tracks/abstract': 'models/tracks/abstract',
		'tracks/mixing.dj': 'models/tracks/mixing.dj',
		'tracks/zippyshare.com': 'models/tracks/zippyshare.com',

		// players
		'players/abstract': 'models/players/abstract',
		'players/jplayer': 'models/players/jplayer'
	},
	'shim': {
		'swfobject': {
			'exports': 'swfobject'
		}
	}
});