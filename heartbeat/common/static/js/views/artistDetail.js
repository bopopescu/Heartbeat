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
    }, 
    render: function() {
      var artist = this.model;
      $(this.el).html(_.template(artistDetailTemplate, artist.toJSON()));
      $(this.el).find("#gallery").gallery({
        interval: 6000,
        height: '200px',
        width: '280px',
        showOverlay: false,
        onChange: function(index, element) {
            $("#gallery_0").children("img").addClass("img-rounded");
        }
      });
      this.albumListView = new AlbumListView({ 'el': $("#album_list"),
        'collection': artist.get("albums"),
        'template': albumTemplate
      });
      this.albumListView.render();
    }
  });
  return ArtistDetail;
});
