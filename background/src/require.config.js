require.config({
	'paths': {
		'backbone': 'vendor/backbone-min',
		'jquery': 'vendor/jquery-2.1.1.min',
		'underscore': 'vendor/underscore-min', // because backbone depends on it

		// core
		'player': 'playit/player',
		'playlist': 'playit/playlist',
		'track_factory': 'playit/track_factory',

		// tracks
		'tracks/mixing.dj': 'playit/tracks/mixing.dj',
		'tracks/abstract': 'playit/tracks/abstract'
	}
});