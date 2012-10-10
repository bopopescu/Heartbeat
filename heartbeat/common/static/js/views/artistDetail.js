define([
  'jquery',
  'underscore',
  'backbone',
  'artist',
  'albums',
  'views/albumListView',
  'text!templates/artistDetail.html',
  'text!templates/album.html',
  'gallery',
], function($, _, Backbone, Artist, Albums, AlbumListView, artistDetailTemplate, albumTemplate) {
  var ArtistDetail = Backbone.View.extend({
    el: $("#artist"),

    initialize: function(options) {
      _.defaults(options, this.defaults);
      _.bindAll(this, 'render');
      this.model.bind("change", this.render);
      this.model.bind("reset", this.render);
      console.log("Binding to change, reset");
      console.log(this.model);
    }, 
    render: function() {
      var artist = this.model;
      if (artist.get("name") == "") {
        return;
      }
      $(this.el).html(_.template(artistDetailTemplate, artist.toJSON()));
      $('.carousel').carousel(2500); 
      var is_editable = artist.is_self();
      this.albumListView = new AlbumListView({ 'el': $("#album_list"),
        'is_editable': is_editable,
        'collection': artist.get("albums"),
        'template': albumTemplate
      });
      this.albumListView.render();
    }
  });
  return ArtistDetail;
});
