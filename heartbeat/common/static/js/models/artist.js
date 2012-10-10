define([
  'jquery',
  'underscore',
  'backbone',
  'album',
  'albums',
], function ($, _, Backbone, Album, Albums) {
  var Artist = Backbone.Model.extend({
    defaults: {
      id: -1,
      name: "",
    },
    initialize: function(options) {
        _.bindAll(this, 'is_self');
        if (options != void 0
            && options.url != void 0) {
            this.url = options.url;
        }
    },
    url: function() {
      return "/api/users/artist/" + this.get("pk") + "/";
    },
    parse: function(response) {
        console.log(response);
        var albums = new Albums();
        var albs = response['albums'];
        for (var i = 0; i < albs.length; i++) {
          albs[i].artist = response['name'];
          albs[i].artist_id = response['id'];
        }
        albums.reset(response['albums']);
        response['albums'] = albums;
        return response;
    },
    is_self: function() {
      return this.get("user_artist_id") == this.get("id")
    },
  });
  return Artist;
});
