define([
    'jquery',
    'backbone',
    'underscore'
], function ($, Backbone, _) {
    var User = Backbone.Model.extend({
        defaults: {
            username: "",
            loggedin: false,
            is_rtist: false,
            error: "",
	        api_key: "",
            artist_id: -1,
            csrf_token: ""
        },
        initialize: function() {
            _.bindAll(this, 'logIn', 'loggedIn');
            var user = this;
            var username = this.get('username');
            var id = this.get('artistId');
            var that = this;
            $.ajax({
                type: "GET",
                url: "/api/users/profile/loggedin/",
                beforeSend: function(xhr) {
                    console.log(xhr);
                },
                success: function(response, status, xhr, form) {
                  if (void 0 != response['username']
                      && "" != response['username']) {
                    that.logIn(response, status, xhr, form);
                  }
                },
                complete: function(one, two) {
                    console.log(one);
                    console.log(two);
                }
            });            
        },
        logIn: function(response, status, xhr, form) {
          if (response['error']) {
            this.set({'error': response['error']});
            return false;
          }
          var username = response['username'];
          var artistId = parseInt(response['artist_id']);
	        if (undefined != response['api_key']
		          || void 0 != response['api_key']) {
	          this.set({ "api_key": response['api_key'] });
	        }
          if (undefined != response['csrf_token']
              || void 0 != response['csrf_token']) {
            this.set({ "csrf_token": response['csrf_token'] });
          }
          if (username == null) {
            this.trigger("error", "Illegal username, password combination");
            return false;
          }
          var isArtist = (artistId > 0)
            this.set({ 
              username: username,
              artist_id: artistId,
              is_artist: isArtist,
              loggedin: true,
          });
          this.trigger("login");
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
                isArtist: false
            });
            this.trigger("logout");
        },
        loggedIn: function() {
          var loggedIn = this.get("loggedin");
          return this.get("loggedin");
        }
    });
    return User;
});
