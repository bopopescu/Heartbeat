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
      "click #unfollow": "unfollow",
    },
    initialize: function(options) {
      _.defaults(options, this.defaults);
      _.bindAll(this, 'render', 'follow', 'unfollow', 'handlefollow');
      this.model.bind("change", this.render);
      this.model.bind("reset", this.render);
      var that = this;
      vent.bind("didfollow", function(artist_id) { 
        if (artist_id == that.model.get("id")) { that.handlefollow(true) } 
      });
      vent.bind("unfollow", function(artist_id) { 
        if (artist_id == that.model.get("id")) { that.handlefollow(false) } 
      });
    }, 
    follow: function(event) {
      vent.trigger("follow", this.model.get("id"));
      this.handlefollow(true);
    },
    unfollow: function(event) {
      vent.trigger("unfollow", this.model.get("id"));
      this.handlefollow(false);
    },
    handlefollow: function(following) {
      if (following != this.options.following) {
        this.options.following = following;
        this.render();
      }
    },
    render: function() {
      var artist = this.model;
      if (artist.get("name") == "") {
        return;
      }
      var artistJSON = artist.toJSON();
      artistJSON.following = this.options.following;
      $(this.el).html(_.template(artistDetailTemplate, artistJSON));
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
