define(['q', 'jquery', 'tracks/abstract'], function(Q, $, abstract_track) {
	'use strict';

	return abstract_track.extend({
		prepare: function() {
			var self = this;
			var play_url = this.source_url().match(/(\?v=|\/v\/)(.*?)($|\?)/)[2];

			Q($.ajax("https://gdata.youtube.com/feeds/api/videos/" + play_url + "?v=2&alt=json",
				{ dataType: "json" }))
				.then(function(video_info) {
					self.set_ready(play_url, video_info.entry.title.$t, video_info.entry.media$group.media$thumbnail[0].url);
				})
				.catch(function(e) {
					self.unplayable();
				})
				.finally(function() {
					self.preparing = false;
				});
		},
		play_type: function() {
			return abstract_track.play_type_youtube;
		}
	}, {
		can_play: function(url) {
			return url.match(/(youtube)(.*)(\?v=|\/v\/)(.*?)($|\?)/) != null;
		}
	});
});