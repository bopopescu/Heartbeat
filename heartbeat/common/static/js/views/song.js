define([
    'jquery',
    'backbone',
    'underscore',
    'song',
    'text!templates/song.html',
], function($, Backbone, _, Song, songTemplate) {
    var SongView = Backbone.View.extend({
        events: {
            "click i.icon-play": 'play',
            "click i.icon-pause": 'pause',
            "click i.icon-download-alt": 'download',
        },
        initialize: function(options) {
            _.bindAll(this, 'render', 'play', 'pause', 'download');
            this.model.bind("change", this.render);
        },
        render: function() {
            $(this.$el).html(_.template(songTemplate, {
              name: this.model.get("name"),
              id: this.model.get("id"),
              is_playing: this.model.is_playing(),
            }));
        },
        play: function() {
            console.log("You clicked ma shit");
            console.log(this.model);
            this.model.play();
        },
        pause: function() {
            this.model.pause();
        },
        download: function() {
            this.model.download();
        }
    });
    return SongView;
});
