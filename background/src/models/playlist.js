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
				list: []
			},
			tracks: track_collection,
			list: function() {
				return this.get('list');
			},
			current: function() {
				return this.get('current_track');
			},
			add: function(url, next) {
				var track = this.tracks.create_track(url);

				if (track == null) {
					// TODO: display failure to user
					return;
				}

				var list = _.clone(this.list());
				if (next && list.length > 1) {
					list.splice(1, 0, track.id);
				} else {
					list.push(track.id);
				}

				this.set('list', list);

				if (this.list().length == 1) {
					this.play();
				}
			},
			clear: function() {
				this.set({list: []});
				this.tracks.remove(this.tracks.models); //TODO: only remove tracks that are not in any playlist
			},
			play: function() {
				var track = this.tracks.get(this.list()[this.current()]);
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