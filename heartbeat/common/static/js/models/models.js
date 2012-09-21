define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    var User = Backbone.Model.extend({
        defaults: {
            username: "",
            loggedin: false,
            isArtist: false,
            artistId: -1
        },
        initialize: function() {
            
        },
        logIn: function(username, artistId) {
            var isArtist = (artistId >= 0);
            this.set({ 
                username: username,
                artistId: artistId,
                isArtist: isArtist,
                loggedin: true,
            });
        },
        logOut: function() {
            this.set({
                username: "",
                loggedin: false,
                isArtist: false
            });
        }
    });
    
    var user = new User();

    var Song = Backbone.Model.extend({
        defaults: {
            path: "",
            name: "",
            artist: "",
            album: "",
            isPlaying: false,
            player: $("#player")
        },
        play: function(callback) {
            player.jPlayer("setMedia", {
                mp3: path
            }).jPlayer("play");
            callback();
        },
        pause: function(callback) {
            player.jPlayer("pause");
            callback();
        },
        resume: function(callback) {
            player.jPlayer("play");
            callback();
        },
        stop: function(callback) {
            isPlaying: false;
            callback();
        }
    });
    return new User;
});