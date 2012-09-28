define([
    'jquery',
    'backbone',
    'underscore',
    'views/playerView',
    'util',
], function ($, Backbone, _, Player, util) {

    var Song = Backbone.Model.extend({
        defaults: {
            path: "",
            name: "",
            track_num: -1,
            player: undefined,
            is_playing: false,
            is_paused: false,
        },
        initialize: function() {
          _.bindAll(this, "is_playing", "play", "handle_play", "pause", "handle_pause", 'resume', 'stop', 'handle_error'); 
        },
        play: function() {
          Player.on("error", this.handle_error);
          Player.on("stop", this.stop);
          Player.on("pause", this.handle_pause);
          Player.on("play", this.handle_play);
          Player.on("render", function() { this.trigger("change"); });
          Player.play_song(this);
          this.handle_play();
        },
        is_playing: function() {
          return Player.is_playing();
        },  
        pause: function() {
            Player.pause();
            this.handle_pause();
        },
        resume: function() {
            Player.play();
            this.handle_play();
        },
        handle_pause: function() {
          this.set({ "is_paused": true });
          this.trigger("change");
        },
        handle_play: function() {
          this.set({ "is_playing": true,
            "is_paused": false,
          });
          this.trigger("change");
        },
        stop: function() {
            Player.off("error");
            Player.off("pause");
            Player.off("play");
            Player.off("stop");
            this.set({ 'is_playing': false,
              'is_paused': false,
            });
        },
        download: function() {
          util.download(this.get("download_link"));
        },
        handle_error: function() {
          this.stop();
        },
    },
    {
      fromJSON: function(song, album) {
        var newsong = new Song({
          path: song.fields.download_link,
          name: song.fields.name,
          track_num: song.fields.track_num,
          album: album,
        })
        return newsong;
      },
    });
    return Song;
});
