define(['q', 'jquery', 'underscore', 'tracks/abstract', 'tracks/zippyshare.com'], function(Q, $, _, abstract_track, zippy) {
	'use strict';

	return abstract_track.extend({
		prepare: function() {
			var self = this;
			var zippy_root;
			var title = null;
			var image = null;

			Q($.get(this.source_url()))
				.then(function(set_page) {
					var matches = set_page.match(zippy.page_regex);

					if (matches == null) {
						throw "unable to determine mixing.dj track";
					}

					var title_matches = set_page.match(/<title>(.*?) Live Sets/);
					if (title_matches) {
						title = _.unescape(title_matches[1]);
					}

					var image_matches = set_page.match(/<link rel="image_src" href="(.*?)" \/>/);
					if (image_matches) {
						image = image_matches[1];
					}

					zippy_root = matches[1];
					return $.get(matches[0]);
				})
				.then(function(page) {
					var mp3_href = zippy.parse_page(page);

					if (mp3_href == null) {
						throw "unable to determine mixing.dj/zippy play url";
					}

					self.set({
						play_url: zippy_root+mp3_href,
						ready: true,
						title: title,
						image: image
					});
					self.dispatcher.trigger(abstract_track.event_types.ready, self);
				})
				.catch(function(e) {
					self.unplayable();
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