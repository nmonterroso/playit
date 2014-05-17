define(
	[
		'underscore',
		'backbone',
		'collections/track',
		'tracks/abstract'
	],
	function(_, Backbone, track_collection, abstract_track) {
		'use strict';

		var playlist = Backbone.Model.extend({
			defaults: {
				current_track: 0,
				list: []
			},
			tracks: track_collection,
			initialize: function() {
				var self = this;
				this.tracks.dispatcher.on(abstract_track.event_types.unplayable, function(track) {
					self.remove(track.id);
				});
			},
			list: function() {
				return this.get('list');
			},
			current: function() {
				return this.get('current_track');
			},
			track: function() {
				return this.tracks.get(this.list()[this.current()]);
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
				var position = _.indexOf(this.list(), id);
				if (position == -1) {
					return;
				}

				if (position == this.current() && position > 0 && position == this.list().length - 1) {
					this.set({current_track: this.current() - 1});
				}

				this.set('list', _.without(this.list(), id));
				playlist.remove_orphans(this.collection);
			},
			clear: function() {
				this.set({list: []});
				playlist.remove_orphans(this.collection);
			},
			play: function() {
				var track = this.tracks.get(this.list()[this.current()]);
				track.play();
			},
			play_at: function(index) {
				if (!_.isNumber(index)) {
					index = _.indexOf(this.list(), index);
				}

				this.set({current_track: index});
				this.play();
			},
			play_next: function() {
				var next = this.current() + 1;
				if (next >= this.list().length) {
					return;
				}

				this.set({current_track: this.current() + 1});
				this.play();
			},
			play_prev: function() {
				var prev = this.current() - 1;
				if (prev < 0) {
					return;
				}

				this.set({current_track: prev});
				this.play();
			},

			// requests coming from chrome
			details: function() {
				var current = this.track();
				return {
					current_track: current.id,
					track_list: this.tracks.models
				}
			}
		}, {
			track_collection: track_collection,
			remove_orphans: function(collection) {
				var in_use_ids = _.union(_.flatten(_.map(collection.models, function(playlist) {
					return playlist.list();
				})));

				var unused_tracks = this.track_collection.filter(function(track) {
					if (_.indexOf(in_use_ids, track.id) == -1) {
						console.log('unused track: '+track.id+' - '+track.source_url());
						return true;
					}

					return false;
				});

				this.track_collection.remove(unused_tracks);
			}
		});

		return playlist;
	}
);