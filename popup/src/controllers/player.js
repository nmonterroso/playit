define(['angular', 'underscore'], function(ng, _) {
	'use strict';

	ng.module('playit.controllers')
		.controller('player_controller', ['$scope', '$rootScope', function($scope, $rootScope) {
			$scope.someKey = "HI FRIENDS";
		}]);
});