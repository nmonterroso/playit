require.config({
	'baseUrl': '/popup/src',
	'paths': {
		// common
		'underscore': '/common/underscore-min',
		'jquery': '/common/jquery-2.1.1.min',

		'angular': 'vendor/angular'
	},
	'shim': {
		'angular': {
			'exports': 'angular'
		}
	}
});