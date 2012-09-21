define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    var Song = Backbone.Model.extend({
        defaults: {
            path: "",
            name: "",
            track_num: -1,
            isPlaying: false,
            isPaused: false,
            player: $("#player")
        },
        initialize: function() {},

        play: function(callback) {
            player.jPlayer("setMedia", {
                mp3: path
            }).jPlayer("play");
            this.set({ "isPlaying": true,
                       "isPaused": false });
        },
        pause: function(callback) {
            player.jPlayer("pause");
            this.set({ "isPaused": true });
        },
        resume: function(callback) {
            player.jPlayer("play");
            this.set({ "isPaused": false });
            
        },
        stop: function(callback) {
            isPlaying: false;
            this.set({ "isPlaying": false,
                       "isPaused": false });
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
