define(['q', 'jquery', 'tracks/abstract'], function(Q, $, abstract_track) {
	'use strict';

	var zippy = abstract_track.extend({

	}, {
		page_regex: /(http:\/\/www([0-9]+)\.zippyshare.com)\/([a-z]+)\/([0-9]+)\/file\.html/,
		can_play: function(url) {
			return url.match(this.page_regex) != null;
		},
		parse_page: function(page) {
			var somd_match = page.match(/somdfunction =([\s\S]*?)<\/script>/);

			if (somd_match != null) {
				var somd_func = somd_match[1]
					.replace(/document\.getElementById\('dlbutton'\)\.omg/, 'var url') // replace initial set
					.replace(/document\.getElementById\('dlbutton'\)\.omg/, 'url') // replace parseInt() call
					.replace(/document\.getElementById\('dlbutton'\)\.href\s+=/, 'return'); // return the results

				var get_href = new Function("'use strict'; return ("+somd_func+")()");
				return get_href();
			}
		}
	});

	return zippy;
});