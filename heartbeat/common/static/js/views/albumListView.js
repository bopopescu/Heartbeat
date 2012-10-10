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
            is_editable: false,
            template: albumTemplate,
          }
        },
        events: {
          "click a": 'handleClick',
        },
        initialize: function(options) {
            this.options = _.extend(this.defaults(), options)
            _.bindAll(this, 'render');
            var that = this;
            this.collection.bind("change", function() { console.log("OH NO A CHANGE!") ; that.render(); that.render(); that.render()});
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
            $(this.el).append(_.template(albumBoxTemplate, {}));
            this.albums = $(this.el).find("dl");
            var that = this;
            this.collection.each(function(album) {
              album.attributes['is_editable'] = that.options.is_editable;
              var tmp = new AlbumView({ model: album, template: that.options.template });
              tmp.render();
              that.albums.append(tmp.$el);
              console.log("APPENDING ALBUM " + that.collection.length);
            });
            $("time").timeago();
        },
    });
    return AlbumListView;
});
