require.config({
	'baseUrl': '/popup/src',
	'paths': {
		// common
		'underscore': '/common/underscore-min',
		'jquery': '/common/jquery-2.1.1.min',

		'angular': 'vendor/angular',
		'jquery-ui': 'vendor/jquery-ui-1.10.4.custom'
	},
	'shim': {
		'angular': {
			'exports': 'angular'
		},
		'jquery-ui': {
			'exports': '$',
			'deps': ['jquery']
		}
	}
});