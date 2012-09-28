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
            "click i.icon-heart": "like",
            "click a": 'handleClick',
        },
        player: $("#player"),
        initialize: function(options) {
          this.playing = undefined;
          this.$el = $("#nav1");
          this.player = $("#player");
          _.bindAll(this, 'ready', 'play', 'pause', 'setmedia', 'display_error', 'render', 'is_playing', 'play_song');
          var that = this;
          this.player.jPlayer({
            ready: this.ready,
            error: this.display_error,
            play: function() { that.trigger("play"); that.render(); },
            pause: function() { that.trigger("pause"); that.render(); },
            ended: function() { that.trigger("stop"); that.get_next(); },
          });
          this.render();
        },
        handleClick: util.handleClick,

        ready: function() {
            console.log($("#player"));
        },
        play_song: function(song) {
          this.playing = song;
          this.setmedia(song.get('download_link'));
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
        back: function() {
            this.player.jPlayer("stop");
            this.player.jPlayer("play");
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
            this.model.get_next();
        },
        display_error: function(error) {
            var play_pause = this.$el.find("#play-pause");
            play_pause.tooltip({
              title: "we can't seem to find that... let me fetch you a better song", 
              placement: "bottom",
              trigger: "manual",
            })
            play_pause.tooltip("show");
            window.setTimeout( function() {
              $("#play-pause").tooltip("hide"); 
            }, 2000);
            this.trigger("error");
            this.render();
        },
        hide_error: function() {
          $("#play-pause").tooltip("destroy");
        },
        render: function() {
            this.$el.html(_.template(playerTemplate, {
              'is_playing': this.is_playing(),
              'playing': this.playing,
            }));
            $(".icon-heart").tooltip({
                title: "we'll play more like this",
                placement: "bottom",
            });
            this.trigger("render");
        },
    });
    var player = new PlayerView();
    return player;
});
