define(['backbone'], function(Backbone) {
	'use strict';

	return Backbone.Model.extend({}, {
		unimplemented: function(method) {
			console.error('unimplemented method', method);
			throw '';
		},
		play: function(url) {
			this.unimplemented('play');
		},
		pause: function() {
			this.unimplemented('pause');
		},
		resume: function() {
			this.unimplemented('resume');
		},
		stop: function() {
			this.unimplemented('stop');
		},
		seek: function(time) {
			this.unimplemented('seek');
		},
		volume: function(level) {
			this.unimplemented('volume');
		},
		mute: function() {
			this.unimplemented('mute');
		},
		unmute: function() {
			this.unimplemented('unmute');
		}
	});
});