define(['q', 'jquery', 'tracks/abstract', 'tracks/zippyshare.com'], function(Q, $, abstract_track, zippy) {
	'use strict';

	return abstract_track.extend({
		prepare: function() {
			var self = this;
			var zippy_root;

			Q($.get(this.source_url()))
				.then(function(set_page) {
					var matches = set_page.match(zippy.page_regex);

					if (matches == null) {
						throw "unable to determine mixing.dj track";
					}

					zippy_root = matches[1];
					return $.get(matches[0]);
				})
				.then(function(page) {
					var mp3_href = zippy.parse_page(page);

					self.set({
						play_url: zippy_root+mp3_href,
						ready: true
					});
					self.dispatcher.trigger(abstract_track.event_types.ready, self);
				})
				.catch(function(e) {
					self.set('unplayable', true);
					console.error(e);
				})
				.finally(function() {
					self.preparing = false;
				});
		}
	}, {
		can_play: function(url) {
			return url.match(/^http:\/\/mixing\.dj\/([0-9]+)\/livesets/) != null;
		}
	});
});