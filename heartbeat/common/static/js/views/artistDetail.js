define([
  'jquery',
  'underscore',
  'backbone',
  'artist',
  'views/albumListView',
  'text!templates/artistDetail.html',
  'text!templates/album.html',
], function($, _, Backbone, Artist, AlbumListView, artistDetailTemplate) {
  var ArtistDetail = Backbone.View.extend({
    el: $("#artist"),

    initialize: function(options) {
      _.defaults(options, this.defaults);
      _.bindAll(this, 'render');
      this.model.bind("change", this.render);
/*      this.albumListView = new AlbumListView({ 'el': $("#albums"),
        'collection': this.collection }); 
      this.collection.bind("add", this.albumListView.addAlbum);
      */
    }, 
    render: function() {
      var artist = this.model;
      $(this.el).html(_.template(artistDetailTemplate, {
        'name': artist.get("name"),
      }));
      /*
      $(this.el).append("<div id='albums'></div>");
      this.albumListView.render();
      */
    }
  });
  return ArtistDetail;
});
