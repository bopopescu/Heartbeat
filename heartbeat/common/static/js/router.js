define([
    'jquery',
    'underscore',
    'backbone',
    'vent',
    'user',
    'loginBox',
    'views/playerView',
    'jquery.jplayer',
], function($, _, Backbone, Vent, User, LoginBox, PlayerView) {
           
    var AppRouter = Backbone.Router.extend({
        routes: {
            'users/login/': 'showLogin',
            'accounts/register/': 'register',
            'accounts/login/': 'showLogin',
            '': 'showArtists',
            'artists/': 'showArtists',
            'artists/:id/': 'artistDetails',
            'artists/:id/donate/': 'donate',
            'artists/:id/admin/': 'adminArtist',
            'artists/:artist_id/admin/album/new/': 'newAlbum',
            'artists/:artist_id/admin/album/:album_id/': 'editAlbum',
            'features/': 'featureList',
            "*actions": 'defaultAction'
        },
        initialize: function() {
          _.bindAll(this, 'login', 'logout');
          Vent.on('login', this.login);
          Vent.on('logout', this.logout);
        },
        login: function() {
          if (this.artist) {
            this.artist.attributes['user_artist_id'] = this.user.artist_id();
          }
          this.rerender();
        },
        logout: function() {
          if (this.artist) {
            this.artist.attributes['user_artist_id'] = -1;
          }
          this.rerender();
        },
        rerender: function() {
          if (this.currentViews) {
            for (var i = 0; i < this.currentViews.length; i++) {
              this.currentViews[i].render();
            }
          }
        },
        showLogin: function(){
            if (this.user.loggedIn()) {
              Backbone.history.navigate("/", { trigger: true });
              return;
            }
            var that = this;
            require(['views/loginView'], function(LoginView) {
              $("#content").html("<div id='login_form'></div>");
              var loginView = new LoginView({ 
                  'model': that.user,
                  'el': $("#login_form")
              });
              loginView.render();
              that.currentViews = [ loginView ];
            });
        },
        showArtists: function(){
            var that = this;
            require(['albums', 'views/albumListView'], function(Albums, AlbumListView) {
              $("#content").html("<div id='album_list'></div>");
              var hotAlbums = new Albums([], { 'url': '/api/users/hot_albums/' });
              var albumListView = new AlbumListView({ 'el': $("#album_list"),
                                                     'collection' : hotAlbums,
              });
              hotAlbums.fetch({
                  success: function(a, b, c) {
                    albumListView.render();
                  }
              });
              that.currentViews = [ albumListView ];
            });
        },
        register: function() {
          Backbone.history.navigate("/accounts/login/", {trigger: true});
          return;
          if (this.user.loggedIn()) {
            Backbone.history.navigate("/", { trigger: true });
            return;
          }
          var that = this;
          require(['views/registerUser'], function(RegisterUser) {
            $("#content").html("<div id='register_form'></div>");
            var registerView = new RegisterUser({ 'el': $("#register_form"),
                                                   'model': that.user });
            that.currentViews = [ registerView ];
          });
        },
        artistDetails: function(id) {
          var that = this;
          require([ 'artist', 'views/artistDetail', 'text!templates/album.html' ], 
              function(Artist, ArtistDetailView, albumTemplate) {
            $("#content").html("<div id='artist_detail'></div>");
            that.artist = new Artist({ 'user_artist_id': that.user.artist_id(),
              'id': id,
              'url': '/api/users/artist_details/' + id + '/' });
            var artistView = new ArtistDetailView({ 'el': $("#artist_detail"),
              'model': that.artist,
            });
            that.artist.fetch({
              success: function(model) {
                that.user.isfollowing(id, function(following) {
                  artistView.handlefollow(following);
                });
              }, 
            });
            that.currentViews = [ artistView ];
          });
        },
        donate: function(artist_id) {
          var that = this;
          require(['views/donation'], function(DonationView) {
            $("#content").html("<div id='donation'></div>");
            var donationView = new DonationView({ 'el': $("#donation") });

            donationView.render();
            that.currentViews = [ donationView ];
          });
        },
        adminArtist: function(id) {
          var that = this;
          this.user.whenLoggedIn(function() {
            if (that.user.artist_id() != id) {
              Backbone.history.navigate('/', { trggier: true });
              return;
            }
          
            require(['artist', 'views/artistDetail'], function(Artist, ArtistDetail) {
              var artist = new Artist({ 'is_self': true,
                'user_artist_id': that.user.get('artist_id'),
                'url': '/api/users/artist_details/' + id + '/'
              });
              $("#content").html("<div id='admin_artist'></div>");
              var adminView = new ArtistDetail({ 'el': $("#admin_artist"),
                'model': artist,
                'admin': true,
              });
              artist.fetch();
              that.currentViews = [ adminView ];
            });
          });
        },
        editAlbum: function(artist_id, album_id) {
          var that = this;
          require(['album', 'views/editAlbum'], function(Album, EditAlbum) {
            that.user.whenLoggedIn(function(loggedin) {
              if (that.user.artist_id() != artist_id) {
                Backbone.history.navigate('/', { trigger: true });
                return;
              } 

              $("#content").html("<div id='edit_album'></div>");
              var album = new Album({ id: album_id });
              var editAlbum = new EditAlbum({el: $("#edit_album"),
                model: album 
              });
              album.fetch({
                success: function() { editAlbum.render(); }, 
              });
              
              that.currentViews = [ editAlbum ];
            });
          });
        },
        newAlbum: function(artist_id) {
          var that = this;
          require(['album', 'views/editAlbum'], function(Album, EditAlbum) {
            that.user.whenLoggedIn(function(loggedin) {
              if (that.user.artist_id() != artist_id) {
                Backbone.history.navigate('/', { trigger: true });
                return;
              } 

              $("#content").html("<div id='edit_album'></div>");
              var album = new Album({"artist_id": artist_id, "artist": that.user.get("artist")  });
              var editAlbum = new EditAlbum({el: $("#edit_album"),
                model: album 
              });
              editAlbum.render();
              that.currentViews = [ editAlbum ];
            });
          });
        },
        featureList: function() {
          var that = this;
          require(['features', 'views/featureList'], function(Features, FeatureList) {
            that.user.whenLoggedIn(function(loggedin) {
              if (!that.user.get('is_artist')) {
                Backbone.history.navigate('/', {trigger: true }); 
                return;
              }
              $("#content").html("<div id='featurelist'></div>");
              var features = new Features();
              var featureList = new FeatureList({ el: $("#featurelist"),
                collection: features,
                user_id: that.user.get('id'),
              });
              features.fetch({
                success: function(a, b, c) {
                  featureList.render();
                },
              });
            });
          });
        },
        defaultAction: function() {
        }
    });

    var initialize = function(){
      var player = PlayerView;
      var app_router = new AppRouter;
      app_router.user = new User();
      this.loginBox = new LoginBox({ el: $("#nav2.nav"), 'model': app_router.user });
      Backbone.history.start({ 'pushState': true });
    };
    
    var refresh = function(user) {
        Loader.load(window.location.pathname, function(a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
            this.loginBox = new LoginBox({ 'model': user });
            Backbone.history.start({ 'pushState': true });
        });
    }
    return {
        initialize: initialize
    };
});
