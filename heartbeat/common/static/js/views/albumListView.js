define([
    'jquery',
    'backbone',
    'underscore',
    'album',
    'text!templates/albumBox.html',
    'text!templates/album_details.html',
    'timeago',
], function($, Backbone, _, Album, albumBoxTemplate, albumTemplate) {
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
        handleClick: function(event) {
          event.preventDefault();
          if ($(event.target).attr('href') !== undefined) {
            Backbone.history.navigate($(event.target).attr("href"), { trigger: true })
          }
        },
        addAlbum: function(album) {
          var template = albumTemplate;
          if (this.options.template) {
            template = this.options.template;
          }
          $(this.el).append(_.template(template, album.toJSON()));
          $("time").timeago();
        },
        render: function() {
            $(this.el).empty();
            $(this.el).append(_.template(albumBoxTemplate, {}));
            var that = this;
            this.collection.each(function(album) {
              that.addAlbum(album);
            });
        },
    });
    return AlbumListView;
});
