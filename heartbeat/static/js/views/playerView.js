define([
    'jquery',
    'backbone',
    'underscore',
    'text!templates/player.html',
    'util',
    'jquery.jplayer',
    'bootstrap',
], function($, Backbone, _, playerTemplate, util) {
    var PlayerView = Backbone.View.extend({
        events: {
            "click i.icon-play": "play_pause",
            "click i.icon-pause": "play_pause",
            "click i.icon-backward": "back",
            "click i.icon-forward": "skip",
            "click i.icon-heart": "like",
            "click a": 'handleClick',
        },
        player: $("#player"),
        initialize: function(options) {
          this.playing = undefined;
          this.$el = $("#nav1");
          this.play_error = "";
          _.bindAll(this, 'ready', 'play', 'pause', 'setmedia', 'display_error', 'render', 'is_playing', 'play_song', 'get_next', 'play_now', 'play_next');
          var that = this;
          this.isready = false;
          this.player = $("#player");
          this.player.jPlayer({
            ready: this.ready,
            error: this.display_error,
            play: function() { console.log("PLAYING"); that.trigger("play"); that.render(); },
            pause: function() { console.log("PAUSE"); that.trigger("pause"); that.render(); },
            ended: function() { console.log("ENDED"); that.trigger("stop"); that.play_next(); },
            wmode: "window",
            solution: "html, flash",
            swfPath: "/static/js/libs/jPlayer/Jplayer.swf",
            supplied: "mp3",
          });
          this.render();
        },
        handleClick: util.handleClick,

        ready: function() {
          console.log("READY")
          this.isready = true;
        },
        play_song: function(song) {
          this.playing = song.toJSON()
          this.play_now()
        },
        play_now: function() {
          console.log("PLAY NOW")
          this.setmedia(this.playing.download_link);
          this.play(0);
          console.log("Played now");
        },
        play: function(time) {
            console.log("Preplay");
            this.player.jPlayer("play", time);
            console.log("Postplay");
        },
        pause: function() {
            this.player.jPlayer("pause");
        },
        is_playing: function() {
          if (!this.isready) { return false; }
          var stat = this.player.data().jPlayer.status;
          return (stat.srcSet && !stat.paused); 
        },
        play_pause: function() {
            if (this.is_playing()) {
              this.pause();
            } else {
              this.play();
            }
        },
        get_next: function(callback) {
          var that = this;
          var track_num = this.playing.track_num + 1;
          var album_id = this.playing.album_id;
          $.ajax({
            url: "/api/users/song/next",
            contentType: "application/json",
            data: {
              album: album_id,
              track_num: track_num,
            },
            dataType: "json",
            beforeSend: function(a,b,c) {
              console.log(a);
              console.log(b);
              console.log(c);
            },
            success: function(data, textStatus, xhr) {
              callback(data.song);
              console.log(data); 
            },
            error: function(xhr, textStatus, error) {

            },
          });
        },
        back: function() {
            this.player.jPlayer("stop");
            this.player.jPlayer("play");
        },
        skip: function() {
          this.play_next();
        },
        setmedia: function(link) {
            console.log("Set media");
            this.player.jPlayer("setMedia", { 
              mp3: link,
            });
            console.log("Post set media");
        },
        like: function() {
            this.model.like();
        },
        ended: function() {
          this.play_next();
        },
        play_next: function() {
          var that = this;
          this.get_next(function(song) {
            that.playing = song;
            that.trigger("stop");
            that.play_now();
            that.update_playing_dom();
          });
        },
        display_error: function(error) {
            console.log(error);
            this.play_error = "can't find that song... let me find another";
            this.render();
            $("#play-pause").tooltip("show");
            setTimeout(function() { 
              $("#play-pause").tooltip("hide");
            }, 2000);
            this.trigger("error");
            this.play_next();
        },
        hide_error: function() {
          $("#play-pause").tooltip("destroy");
        },
        render: function() {
            console.log("Render");
            this.$el.html(_.template(playerTemplate, {
              'is_playing': this.is_playing(),
              'playing': this.playing,
              'play_error': "",
            }));

            /*
            $(".icon-heart").tooltip({
                title: "we'll play more like this",
                placement: "bottom",
            });
            $("#play-pause").tooltip({
              "title": this.play_error,
              "trigger": "manual",
              "placement": "bottom",
            });
            */
        },
        update_playing_dom: function() {

        },
    });

    var player = new PlayerView();
    return player;
});
