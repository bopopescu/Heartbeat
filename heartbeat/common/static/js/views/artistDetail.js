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
      "click #donate": "donate",
      "click #concert": "bookConcert",
    },
    initialize: function(options) {
      var self = this;
      _.defaults(options, this.defaults);
      _.bindAll(this, 'render', 'follow', 'unfollow', 'handlefollow');
      this.model.bind("change", this.render);
      this.model.bind("reset", this.render);
      vent.on('logout', function() { self.handlefollow(false); });
    }, 
    follow: function(event) {
      vent.trigger("follow", [this.model.get("id")]);
      this.handlefollow(true);
    },
    unfollow: function(event) {
      vent.trigger("unfollow", [this.model.get("id")]);
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
    },
    donate: function() {
      Backbone.history.navigate("/artists/" + this.model.get("id") + "/donate/", {trigger: true});
    },
    bookConcert: function() {
      Backbone.history.navigate("/offers/new/" + this.model.get("id") + "/", {trigger: true});
    },
  });
  return ArtistDetail;
});
