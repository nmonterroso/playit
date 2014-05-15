define(
	[
		'underscore',
		'backbone',
		'collections/track'
	],
	function(_, Backbone, track_collection) {
		'use strict';

		return Backbone.Model.extend({
			defaults: {
				current_track: 0,
				ordered_list: []
			},
			initialize: function() {
				this.track_collection = null;
			},
			get_collection: function() {
				if (this.track_collection == null) {
					this.track_collection = new track_collection(this.id);
					this.track_collection.fetch();
				}

				return this.track_collection;
			},
			list: function() {
				return this.get('ordered_list');
			},
			current: function() {
				return this.get('current_track');
			},
			add: function(url, next) {
				var track;

				try {
					track = this.get_collection().create({
						source_url: url
					});
				} catch (e) {
					console.error(e);
					return;
				}

				if (next && this.get_collection().size > 0) {
					this.list().splice(1, 0, track.id);
				} else {
					this.list().push(track.id);
				}

				if (this.list().length == 1) {
					this.play();
				}
			},
			clear: function() {
				this.set({ordered_list: []});
				this.get_collection().remove(this.get_collection().models);
			},
			play: function() {
				var track = this.get_collection().get(this.list()[this.current()]);
				track.play();
			},
			play_next: function() {
				this.set({current_track: this.current() + 1});
				this.play();
			},
			play_prev: function() {
				this.set({current_track: this.current() - 1});
				this.play();
			}
		});
	}
);