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
        events: {
          "click a": 'handleClick',
        },
        initialize: function(options) {
            _.bindAll(this, 'render', 'addAlbum');
            this.render();
            this.collection.bind("change", this.render);
            this.collection.bind("reset", this.render);
            this.collection.bind("add", this.addAlbum);
        },
        handleClick: util.handleClick,
        addAlbum: function(album) {
          $(this.el).append(new AlbumView({ model: album, template: this.options.template }))
          $("time").timeago();
        },
        render: function() {
            $(this.el).empty();
            $(this.el).append(_.template(albumBoxTemplate, {}));
            var that = this;
            var template = "";
            if (this.options.hasOwnProperty('template')) {
                template = this.options.template;
            } else {
                template = albumTemplate;
            }
            var albums = $(that.el).find("dl");
            this.collection.each(function(album) {
                var tmp = new AlbumView({ model: album, template: template });
                tmp.render();
                albums.append(tmp.$el);
            });
        },
    });
    return AlbumListView;
});
