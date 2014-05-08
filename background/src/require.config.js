require.config({
	'paths': {
		'backbone': 'vendor/backbone-min',
		'jquery': 'vendor/jquery-2.1.1.min', // because backbone depends on it
		'underscore': 'vendor/underscore-min',
		'q': 'vendor/q',

		// core
		'player': 'playit/player',
		'playlist': 'playit/playlist',
		'track_factory': 'playit/track_factory',

		// tracks
		'tracks/abstract': 'playit/tracks/abstract',
		'tracks/mixing.dj': 'playit/tracks/mixing.dj',
		'tracks/zippyshare.com': 'playit/tracks/zippyshare.com'
	}
});