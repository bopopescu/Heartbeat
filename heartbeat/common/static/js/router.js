define([
    'jquery',
    'underscore',
    'backbone',
    'vent',
    'user',
    'loginBox',
    'jquery.jplayer',
], function($, _, Backbone, Vent, User, LoginBox) {
           
    var AppRouter = Backbone.Router.extend({
        routes: {
            'users/login/': 'showLogin',
            'accounts/register/': 'register',
            '': 'showArtists',
            'artists/': 'showArtists',
            'artists/:id/': 'artistDetails',
            'artists/:id/admin/': 'adminArtist',
            'artists/:artist_id/admin/album/:album_id/': 'editAlbum',
            "*actions": 'defaultAction'
        },
        initialize: function() {
          _.bindAll(this, 'login', 'logout');
          Vent.on('login', this.login);
          Vent.on('logout', this.logout);
        },
        login: function() {
          if (this.artist) {
            this.artist.set({ 'user_artist_id': this.user.artist_id() });
          }
        },
        logout: function() {
          if (this.artist) {
            this.artist.set({ 'user_artist_id': -1 });
          }
        },
        showLogin: function(){
            if (this.user.loggedIn()) {
              Backbone.history.navigate("/", { trigger: true });
              return;
            }
            var that = this;
            require(['views/loginView'], function(LoginView) {
              that.currentViews = [];
              $("#content").html("<div id='login_form'></div>");
              var loginView = new LoginView({ 
                  'model': that.user,
                  'el': $("#login_form")
              }).render();
              that.currentViews.append(loginView);
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
              that.currentViews = [ albumListView ];
              hotAlbums.fetch({
                  success: function(a, b, c) {
                      console.log(a);                  
                      console.log(b);                  
                      console.log(c);                  
                  }
              });
              albumListView.render();
            });
        },
        register: function() {
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
            $("#content").html("<div id='artist_detail'></div><div id='album_list'></div>");
            that.artist = new Artist({ 'user_artist_id': that.user.artist_id(),
              'id': id,
              'url': '/api/users/artist_details/' + id + '/' });
            var artistView = new ArtistDetailView({ 'el': $("#artist_detail"),
               'model': that.artist,
            });
            that.artist.fetch({
              success: function(a,b,c) {
                console.log(a);  
                console.log(b);  
                console.log(c);  
               }, 
            });
            artistView.render();
            that.currentViews = [ artistView ];
          });
        },
        adminArtist: function(id) {
          this.user.whenLoggedIn(function() {
            if (this.user.artist_id() != id) {
              Backbone.history.navigate('/', { trggier: true });
              return;
            }
          
            var that = this;
            require(['artist', 'views/artistAdmin'], function(Artist, ArtistAdmin) {
              var artist = new Artist({ 'is_self': true,
                'url': '/api/users/artist_details/' + id + '/'
              });
              $("#content").html("<div id='admin_artist'></div>");
              var adminView = new ArtistAdmin({ 'el': $("#admin_artist"),
                'model': artist,
              });
              artist.fetch();
            });
          });
        },
        editAlbum: function(artist_id, album_id) {
          var that = this;
          require(['album', 'views/editAlbum'], function(Album, EditAlbum) {
            that.user.whenLoggedIn(function(loggedin) {
              if (that.user.artist_id() != artist_id) {
                Backbone.history.navigate('/', { trggier: true });
                return;
              }

              $("#content").html("<div id='edit_album'></div>");
              var album = new Album({ id: album_id });
              var editAlbum = new EditAlbum({el: $("#edit_album"),
                model: album });
              album.fetch({
                success: function() {
                editAlbum.render();
                }, 
              });
            });
          });
        },
        defaultAction: function() {
            alert(Backbone.history.fragment);
        }
    });

    var initialize = function(){
        //var player = PlayerView;
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
