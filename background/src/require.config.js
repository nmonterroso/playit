require.config({
	'paths': {
		'backbone': 'vendor/backbone',
		'localstorage': 'vendor/backbone.localStorage',
		'jquery': '/common/jquery-2.1.1.min', // because backbone depends on it
		'underscore': '/common/underscore-min',
		'q': 'vendor/q',
		'swfobject': 'vendor/swfobject',

		// jquery deps
		'jquery.jplayer': 'vendor/jquery.jplayer.min',

		// core
		'player': 'models/player',
		'playlist': 'models/playlist',

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