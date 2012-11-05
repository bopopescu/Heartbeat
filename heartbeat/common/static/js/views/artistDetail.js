define([
  'jquery',
  'underscore',
  'backbone',
  'artist',
  'albums',
  'views/albumListView',
  'text!templates/artistDetail.html',
  'text!templates/album.html',
  'vent',
  'gallery',
], function($, _, Backbone, Artist, Albums, AlbumListView, artistDetailTemplate, albumTemplate, vent) {
  var ArtistDetail = Backbone.View.extend({
    el: $("#artist"),
    events: {
      "click #follow": "follow",
    },

    initialize: function(options) {
      _.defaults(options, this.defaults);
      _.bindAll(this, 'render', 'follow');
      this.model.bind("change", this.render);
      this.model.bind("reset", this.render);
    }, 
    follow: function(event) {
      vent.trigger("follow", this.model.get("id"));
    },
    render: function() {
      var artist = this.model;
      if (artist.get("name") == "") {
        return;
      }
      $(this.el).html(_.template(artistDetailTemplate, artist.toJSON()));
      $('.carousel').carousel(2500); 
      var admin = artist.is_self();
      this.albumListView = new AlbumListView({ 'el': $("#album_list"),
        'admin': admin,
        'artist_id': artist.get("id"),
        'collection': artist.get("albums"),
        'template': albumTemplate
      });
      this.albumListView.render();
    }
  });
  return ArtistDetail;
});
