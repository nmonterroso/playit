define(
	[
		'underscore',
		'backbone',
		'collections/track'
	],
	function(_, Backbone, track_collection) {
		'use strict';

		var playlist = Backbone.Model.extend({
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
			track: function() {
				this.tracks.get(this.list()[this.current()]);
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
			remove: function(id) {
				this.set('list', _.without(this.list(), id));
				playlist.remove_orphans();
			},
			clear: function() {
				this.set({list: []});
				playlist.remove_orphans();
			},
			play: function() {
				var track = this.tracks.get(this.list()[this.current()]);
				track.play();
			},
			play_at: function(index) {
				this.set({current_track: index});
				this.play();
			},
			play_next: function() {
				this.set({current_track: this.current() + 1});
				this.play();
			},
			play_prev: function() {
				this.set({current_track: this.current() - 1});
				this.play();
			},

			// requests coming from chrome
			details: function() {
				return {
					current_track: this.current(),
					track_list: JSON.stringify(this.tracks.models)
				}
			}
		}, {
			all_playlists: [],
			collection: track_collection,
			remove_orphans: function() {
				var in_use_ids = _.union(_.flatten(_.map(this.all_playlists, function(playlist) {
					return playlist.list();
				})));

				var unused_tracks = this.collection.filter(function(track) {
					return _.indexOf(in_use_ids, track.id) == -1;
				});

				this.collection.remove(unused_tracks);
			}
		});

		return playlist;
	}
);