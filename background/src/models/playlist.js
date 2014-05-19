define(
	[
		'underscore',
		'backbone',
		'events',
		'collections/track'
	],
	function(_, Backbone, events, track_collection) {
		'use strict';

		var playlist = Backbone.Model.extend({
			defaults: {
				current_track: null,
				list: []
			},
			tracks: track_collection,
			initialize: function() {
				events.dispatcher.on(events.event_types.track.unplayable, function(track) {
					this.remove(track.id);
				}, this);
			},
			list: function() {
				return this.get('list');
			},
			current: function() {
				return this.get('current_track');
			},
			current_index: function() {
				var index = _.indexOf(this.list(), this.current());
				return index == -1 ? 0 : index;
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
			add: function(url, when) {
				var track = this.tracks.create_track(url);

				if (track == null) {
					// TODO: display failure to user
					return;
				}

				var list = _.clone(this.list());
				switch (when) {
					case 'next':
						list.splice(1, 0, track.id);
						break;
					case 'last':
						list.push(track.id);
						break;
					case 'now':
						var current_track = this.track();
						if (current_track) {
							current_track.player().stop();
						}

						list.splice(this.current_index(), 0, track.id);
						break;
					default:
						throw 'unknown add usage: "'+when+'"';
				}

				this.set({ list: list });

				if (this.list().length == 1 || when == 'now') {
					this.set_current(track);
					this.play();
				}
			},
			remove: function(id) {
				if (_.indexOf(this.list(), id) == -1) {
					return;
				}

				if (id == this.current()) {
					var new_current = this.next_index();
					if (!new_current) {
						new_current = this.prev_index();
					}

					this.set_current(new_current);
				}

				this.set({ list: _.without(this.list(), id) });
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
			reorder: function(order) {
				this.set({ list: order });
				return this.list();
			},

			// requests coming from chrome
			details: function() {
				var models = [];
				_.each(this.list(), function(track_id) {
					models.push(this.get(track_id));
				}, this.tracks);

				return {
					current_track: this.current(),
					track_list: models
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