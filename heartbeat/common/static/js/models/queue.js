define([
    'jquery',
    'backbone',
    'underscore',
    'jquery.jplayer',
], function($, Backbone, _) {
    var Queue = Backbone.Model.extend({
        defaults: {
            listened_to: [],
            queue: [],
            playing: undefined,
            data: undefined,
        },
        initialize: function(options) {
            _.bindAll(this, 'error', 'play_now', 'enqueue', 'get_next', 'play', 'pause', 'resume', 'back', 'dislike', 'like', 'opinion_on', 'get_data');
        },
        get_next: function() {
          if (queue.length > 0) {
            this.set({ playing: queue[0] });
            queue.splice(0, 1);
            this.trigger("play", 0);
          }    
        },
        play: function() {
          if (this.get("is_paused")) {
            this.resume();
          } else {
            get_next();
          }
        },
        pause: function() {
            console.log("TRIGGER PAUSE");
            this.trigger("pause");
            this.set({ 'is_playing': false,
                'is_paused': true,
            });
        },
        resume: function() {
            this.trigger("play");
        },
        play_now: function(song) {
            var listened_to = [];
            if (this.get("is_playing") || this.get("playing") !== undefined) {
                this.opinion_on("skip");
                var listened_to = this.get("listened_to");
                listened_to.push(this.get("playing"));
            }
            this.trigger("setMedia", song.get("download_link"));
            this.trigger("play", 0);
            console.log("Should be playing: " + this.get("data").status.paused);
            this.set({ 'listened_to': listened_to,
                'playing': song,
                'is_playing': true,
            });
            return;
        },
        enqueue: function(song) {
            this.get("queue").push(song);
        },
        back: function() {
            this.trigger("play", 0);
        },
        dislike: function() {
            this.opinion_on("dislike");
        },
        like: function() {
            this.opinion_on("like");
        },
        opinion_on: function(opinion) {
            var playing = this.get("playing");
            playing.opinion = opinion;
            this.set({ playing: playing });
        },
        get_data: function() {
            console.log(this.get("data").status);
            return this.get("data");
        },
        error: function(error) {
            this.set({ "is_playing": false, "is_paused": false, "playing": void 0});
            console.log(error);
        },
    });
    var queue = new Queue();
    return queue;
});
