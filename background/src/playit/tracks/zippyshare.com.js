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
				var somd_body = somd_match[1];
				var somd_body_declare_url = somd_body.replace(/document\.getElementById\('dlbutton'\)\.omg/, 'var url');
				var somd_body_use_url = somd_body_declare_url.replace(/document\.getElementById\('dlbutton'\)\.omg/, 'url');
				var somd_return = somd_body_use_url.replace(/document\.getElementById\('dlbutton'\)\.href\s+=/, 'return');

				var get_href = new Function("'use strict'; return ("+somd_return+")()");
				return get_href();
			}
		}
	});

	return zippy;
});