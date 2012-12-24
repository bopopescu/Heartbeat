define([
    'jquery',
    'underscore',
    'backbone',
    'vent',
    'user',
    'loginBox',
    'views/playerView',
    'views/loginView',
    'albums', 
    'views/albumListView',
    'views/registerUser',
    'artist', 
    'views/artistDetail', 
    'text!templates/album.html',
    'views/donation',
    'album', 'views/editAlbum',
    'features', 'views/featureList',
    'offer', 'views/offerView', 
    'jquery.jplayer',
], function($, _, Backbone, Vent, User, LoginBox, PlayerView, 
  LoginView, 
  Albums, AlbumListView,
  RegisterUser,
  Artist,
  ArtistDetailView,
  albumTemplate,
  DonationView,
  Album, EditAlbum,
  Features, FeatureList,
  Offer, OfferView) {
           
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
            'offers/new/:artist_id/': 'newOffer',
            'features/': 'featureList',
            "*actions": 'defaultAction'
        },
        initialize: function() {
          _.bindAll(this, 'login', 'logout');
          Vent.on('login', this.login);
          Vent.on('logout', this.logout);
        },
        login: function() {
        },
        logout: function() {
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
            $("#content").html("<div id='login_form'></div>");
            var loginView = new LoginView({ 
              'model': this.user,
                'el': $("#login_form")
            });
            loginView.render();
            this.currentViews = [ loginView ];
        },
        showArtists: function(){
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
            this.currentViews = [ albumListView ];
        },
        register: function() {
          Backbone.history.navigate("/accounts/login/", {trigger: true});
          return;
          if (this.user.loggedIn()) {
            Backbone.history.navigate("/", { trigger: true });
            return;
          }
          $("#content").html("<div id='register_form'></div>");
          var registerView = new RegisterUser({ el: $("#register_form"),
                                                model: this.user });
          this.currentViews = [ registerView ];
        },
        artistDetails: function(id) {
          // Eagerly load the artist page and then subscribe to notifications for userid
          var self = this;
          $("#content").html("<div id='artist_detail'></div>");
          this.artist = new Artist({ 'user_artist_id': this.user.artist_id(),
            'id': id,
            'url': '/api/users/artist_details/' + id + '/' 
          }),
          artistView = new ArtistDetailView({ 'el': $("#artist_detail"),
            model: this.artist,
          });
          this.artist.fetch({
            success: function(model) {
              self.artist.attributes['following'] = self.user.follows(self.artist.get('id'));
              artistView.render();
              self.user.isfollowing(id, function(following) {
                artistView.handlefollow(following);
              });
            }, 
          });
          this.currentViews = [ artistView ];
        },
        donate: function(artist_id) {
          $("#content").html("<div id='donation'></div>");
          var donationView = new DonationView({ 'el': $("#donation") });

          donationView.render();
          this.currentViews = [ donationView ];
        },
        adminArtist: function(id) {
          var self = this;
          this.user.whenLoggedIn(function() {
            if (self.user.artist_id() != id) {
              Backbone.history.navigate('/', { trggier: true });
              return;
            }
            var artist = new Artist({ 'is_self': true,
              'user_artist_id': self.user.get('artist_id'),
              'url': '/api/users/artist_details/' + id + '/'
            });
            $("#content").html("<div id='admin_artist'></div>");
            var adminView = new ArtistDetailView({ 'el': $("#admin_artist"),
              model: artist,
              admin: true,
            });
            artist.fetch();
            self.currentViews = [ adminView ];
          });
        },
        editAlbum: function(artist_id, album_id) {
          var self = this;
          this.user.whenLoggedIn(function(loggedin) {
            if (self.user.artist_id() != artist_id) {
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
            
            self.currentViews = [ editAlbum ];
          });
        },
        newAlbum: function(artist_id) {
          var self = this;
          this.user.whenLoggedIn(function(loggedin) {
            if (self.user.artist_id() != artist_id) {
              Backbone.history.navigate('/', { trigger: true });
              return;
            } 

            $("#content").html("<div id='edit_album'></div>");
            var album = new Album({"artist_id": artist_id, 
              "artist": self.user.get("artist")  
            });
            var editAlbum = new EditAlbum({el: $("#edit_album"),
              model: album 
            });
            editAlbum.render();
            self.currentViews = [ editAlbum ];
          });
        },
        featureList: function() {
          var self = this;
          this.user.whenLoggedIn(function(loggedin) {
            if (!self.user.get('is_artist')) {
              Backbone.history.navigate('/', {trigger: true }); 
              return;
            }
            $("#content").html("<div id='featurelist'></div>");
            var features = new Features();
            var featureList = new FeatureList({ el: $("#featurelist"),
              collection: features,
              user_id: self.user.get('id'),
            });
            features.fetch({
              success: function(a, b, c) {
                featureList.render();
              },
            });
          });
        },
        newOffer: function(artist_id) {
          var self = this;
          this.user.whenLoggedIn(function(loggedin) {
            if (self.user.artist_id() != artist_id) {
              Backbone.history.navigate('/', {trigger: true});
              return;
            }
            $("#content").html("<div id='offer'></div>");
            var offer = new Offer();
            var offerView = new OfferView({ el: $("#offer"),
              model: offer,
            });
            offerView.render();
          });
        },
        defaultAction: function() {
        }
    });

    var initialize = function(){
      var player = PlayerView;
      var app_router = new AppRouter;
      app_router.user = new User();
      this.loginBox = new LoginBox({ el: $("#nav2.nav"), model: app_router.user });
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
