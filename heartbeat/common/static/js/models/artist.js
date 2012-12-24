define([
  'jquery',
  'underscore',
  'backbone',
  'album',
  'albums',
  'vent',
], function ($, _, Backbone, Album, Albums, vent) {
  var USER_ARTIST_ID = 'user_artist_id';
  var Artist = Backbone.Model.extend({
    defaults: {
      id: -1,
      name: "",
      following: false,
    },
    initialize: function(options) {
        _.bindAll(this, 'is_self', 'logout', 'login');
        if (options != void 0
            && options.url != void 0) {
            this.url = options.url;
        }
        vent.on('login', this.login);
        vent.on('logout', this.logout);
    },
    url: function() {
      return "/api/users/artist/" + this.get("pk") + "/";
    },
    logout: function() {
      this.set({ 
        USER_ARTIST_ID: -1,
        following: false,
      });
    },
    login: function(user) {
      var self = this;
      user.isfollowing(this.get('id'), function(following) {
        self.set({ 
          USER_ARTIST_ID: user.artist_id(),
          following: following,
        });
      });
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
