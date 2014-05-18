define(['backbone'], function(Backbone) {
	'use strict';

	return Backbone.Collection.extend({
		bind_change: function(model) {
			if (model) {
				model.on('change', this.on_change);
			} else {
				this.each(function(model) {
					this.bind_change(model);
				}, this);
			}
		},
		on_change: function(model) {
			model.collection.sync('update', model);
		}
	})
});