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
    },
    url: function() {
      return "/api/users/artist/" + this.get("pk") + "/";
    },
/*    parse: function(response) {
      var albums = response['albums'];
      var newalbums = this.get("albums");
      var artist = {
        'name': response['name'],
        'bio': response['bio'],
        'pk': response['id'],
      }
      for (var i = 0; i < albums.length; i++) {
        newalbums.add(new Album({
          'artist': artist,
          'cover': albums[i].cover,
          'pk': albums[i].id,
          'release_date': albums[i].release_date,
          'title': albums[i].title,
        }));
      }
      this.set({'albums': newalbums });
      delete response['albums'];
      return response;
    },
    */
  });
  return Artist;
});
