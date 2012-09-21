define([
    'jquery',
    'backbone',
    'underscore',
    'album',
    'text!templates/albumBox.html',
    'text!templates/album.html',
], function($, Backbone, _, Album, albumBoxTemplate, albumTemplate) {
    AlbumListView = Backbone.View.extend({
        el: $("#album_list"),
        defaults: {

        },
        events: {
          "click a": 'handleClick',
        },
        initialize: function(options) {
            _.defaults(options, this.defaults);
            _.bindAll(this, 'render');
            this.collection.bind("change", this.render);
            this.render();
        },
        handleClick: function(event) {
          event.preventDefault();
          if ($(event.target).attr('href') !== undefined) {
            Backbone.history.navigate($(event.target).attr("href"), { trigger: true })
          }
        },
        render: function() {
            $(this.el).empty();
            $(this.el).append(_.template(albumBoxTemplate, {}));
            var that = this;
            var albums = $(this.el).find("#albums");
            this.collection.each(function(album) {
              var tmp = album.get("title");

              albums.append(_.template(albumTemplate, {
                'title': album.get("title"),
                'cover': album.get("cover"),
                'artist_name': album.get("artist").get("name"),
                'artist_id': album.get("artist").get("pk"),
                'release_date': album.get("release_date"),
                'id': album.get("pk"),
                'songs': album.get("songs"),
              }));
            });
        },
    });
    return AlbumListView;
});
