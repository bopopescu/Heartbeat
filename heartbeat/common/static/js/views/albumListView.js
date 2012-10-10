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
        defaults: {
          template: albumTemplate,
        },
        events: {
          "click a": 'handleClick',
        },
        initialize: function(options) {
            this.options = _.extend(this.defaults, options)
            _.bindAll(this, 'render', 'addAlbum');
            this.collection.bind("change", this.render);
            this.collection.bind("reset", this.render);
            this.collection.bind("add", this.addAlbum);
            this.render();
        },
        handleClick: util.handleClick,
        addAlbum: function(album) {
          album.set({ is_editable: this.options.is_editable });
          var tmp = new AlbumView({ model: album, template: this.options.template });
          tmp.render();
          this.albums.append(tmp.$el);
          $(this.el).append(new AlbumView({ model: album, template: this.options.template }))
        },
        render: function() {
            $(this.el).empty();
            $(this.el).append(_.template(albumBoxTemplate, {}));
            this.albums = $(this.el).find("dl");
            var that = this;
            this.collection.each(function(album) {
              that.addAlbum(album);
            });
            $("time").timeago();
        },
    });
    return AlbumListView;
});
