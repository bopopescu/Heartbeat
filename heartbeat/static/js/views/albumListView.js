define([
    'jquery',
    'backbone',
    'underscore',
    'album',
    'util',
    'views/album',
    'text!templates/albumBox.html',
    'text!templates/album_details.html',
    'timeago',
], function($, Backbone, _, Album, util, AlbumView, albumBoxTemplate, albumTemplate) {
    AlbumListView = Backbone.View.extend({
        template: undefined,
        el: $("#album_list"),
        defaults: function() {
          return {
            admin: false,
            artist_id: -1,
            template: albumTemplate,
          }
        },
        events: {
          "click a": 'handleClick',
        },
        initialize: function(options) {
            this.options = _.extend(this.defaults(), options)
            _.bindAll(this, 'render');
            this.collection.bind("change", this.render());
            this.collection.bind("reset", this.render);
            //this.collection.bind("add", this.addAlbum);
        },
        handleClick: util.handleClick,
        /*addAlbum: function(album) {
          album.set({ is_editable: this.options.is_editable });
          var tmp = new AlbumView({ model: album, template: this.options.template });
          tmp.render();
          this.albums.append(tmp.$el);
        },*/
        render: function() {
            console.log("Clearing dic");
            $(this.el).empty();
            $(this.el).append(_.template(albumBoxTemplate, {
              'admin': this.options.admin,
              'artist_id': this.options.artist_id,
            }));
            this.albums = $(this.el).find("dl");
            var that = this;
            this.collection.each(function(album) {
              album.attributes['admin'] = that.options.admin;
              var tmp = new AlbumView({ model: album, template: that.options.template });
              tmp.render();
              that.albums.append(tmp.$el);
            });
            $("time").timeago();
        },
    });
    return AlbumListView;
});
