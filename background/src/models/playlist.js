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
				current_track: null,
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
			current_index: function() {
				return _.indexOf(this.list(), this.current());
			},
			next_index: function() {
				var current = this.current_index();
				if (current >= this.list().length - 1) {
					return null;
				}

				return current + 1;
			},
			prev_index: function() {
				var current = this.current_index();
				if (current <= 0) {
					return null;
				}

				return current - 1;
			},
			set_current: function(track) {
				if (_.isObject(track)) { // by track
					this.set({ current_track: track.id })
				} else if (_.isNumber(track)) { // by index
					this.set({ current_track: this.list()[track] });
				} else { // by id
					this.set({ current_track: track });
				}
			},
			track: function() {
				if (this.current() == null) {
					return null;
				}

				return this.tracks.get(this.current());
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
					this.set_current(track);
					this.play();
				}
			},
			remove: function(id) {
				if (id == this.current()) {
					var new_current = this.next_index();
					if (!new_current) {
						new_current = this.prev_index();
					}

					this.set_current(new_current);
				}

				this.set('list', _.without(this.list(), id));
				playlist.remove_orphans(this.collection);
			},
			clear: function() {
				this.set({list: []});
				playlist.remove_orphans(this.collection);
			},
			play: function() {
				var track = this.track();
				if (track == null) {
					return;
				}

				track.play();
				return this.current();
			},
			play_at: function(index) {
				this.set_current(index);
				this.play();

				return this.current();
			},
			play_next: function() {
				var next_index = this.next_index();
				if (next_index === null) {
					return null;
				}

				this.set_current(next_index);
				this.play();

				return this.current();
			},
			play_prev: function() {
				var prev_index = this.prev_index();
				if (prev_index === null) {
					return null;
				}

				this.set_current(prev_index);
				this.play();

				return this.current();
			},

			// requests coming from chrome
			details: function() {
				return {
					current_track: this.current(),
					track_list: this.tracks.models
				}
			},
			get_next_id: function() {
				var next_index = this.next_index();
				if (!next_index) {
					next_index = this.prev_index();
				}

				if (next_index == null) {
					return null;
				}

				return this.tracks.get(this.list()[next_index]).id;
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