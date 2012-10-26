define([
    'jquery',
    'backbone',
    'underscore',
    'jquery.cookie',
], function ($, Backbone, _) {
    var User = Backbone.Model.extend({
        defaults: {
            username: "",
            loggedin: void 0,
            is_artist: false,
            error: "",
            artist_id: -1,
            csrf_token: "",
            checked: false,
        },
        initialize: function() {
            _.bindAll(this, 'logIn', 'loggedIn', 'artist_id');
            var user = this;
            var username = this.get('username');
            var id = this.get('artistId');
            var that = this;
            this.set({ loggedin: $.cookie("user") > 0,
              is_artist: $.cookie("artist_id") >= 0,
              artist_id: $.cookie("artist_id"),
              username: $.cookie("username"),
            });
        },
        logIn: function(response, status, xhr, form) {
          if (response['status'] != "ERROR") {
            this.set({ loggedin: response["id"] > 0,
              is_artist: response["artist_id"] >= 0,
              artist_id: response["artist_id"],
              username: response["username"],
            });
          }
          return true;
        },
        logOut: function() {
            var data = "csrfmiddlewaretoken=" + this.get("csrf_token");
            data += "&username=" + this.get("username");
            $.ajax({
                type: "GET",
                url: "/api/users/profile/logout",
                data: data,
                complete: function(a, b) {
                    console.log(a);
                    console.log(b);
                },
            });
            this.set({
                username: "",
                loggedin: false,
                isArtist: false,
                artist_id: -1,
                error: "",
            });
            this.trigger("logout");
        },
        artist_id: function() {
          return this.get('artist_id');
        },
        loggedIn: function() {
          return this.get("loggedin");
        },
        whenLoggedIn: function(callback) {
          if (this.get("checked")) {
            callback(this.get("loggedin"));
          } else {
            var that = this;
            this.on("loggedin", function() { callback(that.get('loggedin')); });
          }
        },
        checkLoggedIn: function() {
          $.ajax({
            type: "GET",
            url: "/api/users/profile/loggedin/",
            beforeSend: function(xhr) {
              console.log(xhr);
            },
            success: function(response, status, xhr, form) {
              if (response['status'] != "ERROR") {
                that.logIn(response, status, xhr, form);
              } else {
                that.set({ 'loggedin': false });
              }
              that.trigger("loggedin");
            },
            error: function() {
              that.trigger("loggedin");
            },
          }); 
        },
  });
  return User;
});
