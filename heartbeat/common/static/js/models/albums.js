define([
    'jquery',
    'backbone',
    'underscore',
    'album',
], function ($, Backbone, _, Album) {
  var Albums = Backbone.Collection.extend({
    url: "/api/users/hot_albums/",
    model: Album,
    initialize: function(models, options) {
      if (options != void 0
        && options.url != void 0) {
        this.url = options.url;
      }
    },
  });
  return Albums;
});
