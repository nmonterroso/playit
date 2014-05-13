require.config({
	'paths': {
		'backbone': 'vendor/backbone-min',
		'jquery': 'vendor/jquery-2.1.1.min', // because backbone depends on it
		'underscore': 'vendor/underscore-min',
		'q': 'vendor/q',
		'swfobject': 'vendor/swfobject',

		// jquery deps
		'jquery.jplayer': 'vendor/jquery.jplayer.min',

		// core
		'player': 'models/player',
		'playlist': 'models/playlist',

		// utility
		'util/track_factory': 'models/util/track_factory',
		'util/guid': 'models/util/guid',

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