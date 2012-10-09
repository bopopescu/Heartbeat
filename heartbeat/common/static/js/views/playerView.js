define([
    'jquery',
    'backbone',
    'underscore',
    'text!templates/player.html',
    'util',
    'player',
    'jquery.jplayer',
    'bootstrap',
], function($, Backbone, _, playerTemplate, util, Queue) {
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
          this.player = $("#player");
          _.bindAll(this, 'ready', 'play', 'pause', 'setmedia', 'display_error', 'render', 'is_playing', 'play_song', 'get_next', 'play_now', 'play_next');
          var that = this;
          this.player.jPlayer({
            ready: this.ready,
            error: this.display_error,
            play: function() { console.log("PLAYING"); that.trigger("play"); that.render(); },
            pause: function() { that.trigger("pause"); that.render(); },
            ended: function() { that.trigger("stop"); that.play_next(); },
          });
          this.render();
        },
        handleClick: util.handleClick,

        ready: function() {
            console.log($("#player"));
        },
        play_song: function(song) {
          this.playing = song.toJSON()
          this.play_now()
        },
        play_now: function() {
          this.setmedia(this.playing.download_link);
          this.play(0);
          this.trigger("render");
        },
        play: function(time) {
            this.player.jPlayer("play", time);
        },
        pause: function() {
            this.player.jPlayer("pause");
        },
        is_playing: function() {
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
            this.player.jPlayer("setMedia", { 
              mp3: link,
            });
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
            this.$el.html(_.template(playerTemplate, {
              'is_playing': this.is_playing(),
              'playing': this.playing,
              'play_error': "",
            }));
            $(".icon-heart").tooltip({
                title: "we'll play more like this",
                placement: "bottom",
            });
            $("#play-pause").tooltip({
              "title": this.play_error,
              "trigger": "manual",
              "placement": "bottom",
            });
            this.trigger("render");
        },
        update_playing_dom: function() {

        },
    });
    var player = new PlayerView();
    return player;
});
