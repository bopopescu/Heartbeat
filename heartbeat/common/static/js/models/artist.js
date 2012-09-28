define([
  'jquery',
  'underscore',
  'backbone',
  'album',
  'albums',
], function ($, _, Backbone, Album, Albums) {
  var Artist = Backbone.Model.extend({
    defaults: {
      pk: -1,
      name: "",
    },
    initialize: function(options) {
        if (options != void 0
            && options.url != void 0) {
            this.url = options.url;
        }
    },
    url: function() {
      return "/api/users/artist/" + this.get("pk") + "/";
    },
    parse: function(response) {
        var albums = new Albums();
        albums.reset(response['albums']);
        response['albums'] = albums;
        return response;
    },
  });
  return Artist;
});
