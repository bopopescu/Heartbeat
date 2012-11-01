define([
    'jquery',
    'backbone',
    'underscore',
    'album',
    'text!templates/album_details.html',
    'player',
    'views/song',
], function($, Backbone, _, Album, albumTemplate, Player, SongView) {
    var AlbumView = Backbone.View.extend({
        initialize: function(options) {
            if (options.hasOwnProperty('template')) {
                this.template = options.template;
            } else {
                this.template = albumTemplate;
            }
        },
        render: function() {
            $(this.$el).html(_.template(this.template, this.model.toJSON())); 
            var songs = this.model.get("songs");
            var songsDiv = $(this.$el).find("#songs");
            for (var i = 0; i < songs.length; i++) {
                var song = new SongView({ model: songs[i] });
                song.render();
                songsDiv.append(song.$el);
            }
        },
        play: function(event) {
            Player.play_now(this.model.get("songs")[parseInt(event.currentTarget.id)]);
        }
    });
    return AlbumView;
});
