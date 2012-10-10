define([
    'jquery',
    'underscore',
    'backbone',
    'loader',
    'vent',
    'user',
    'albums',
    'artist',
    'loginBox',
    'views/loginView',
    'views/registerUser',
    'views/albumListView',
    'views/artistDetail',
    'views/playerView',
    'views/artistAdmin',
    'jquery.jplayer',
], function($, _, Backbone, Loader, Vent, User, Albums, Artist, LoginBox, LoginView, RegisterUser,
           AlbumListView, ArtistDetailView, PlayerView, ArtistAdmin) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'users/login/': 'showLogin',
            'users/register/': 'register',
            '': 'showArtists',
            'artists/': 'showArtists',
            'artists/:id/': 'artistDetails',
            'artists/:id/admin/': 'adminArtist',
            'artists/:artist_id/admin/album/:album_id': 'editAlbum',
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
            this.currentViews = [];
            $("#content").html("<div id='login_form'></div>");
            var loginView = new LoginView({ 
                'model': this.user,
                'el': $("#login_form")
            }).render();
            this.currentViews.append(loginView);
        },
        showArtists: function(){
            $("#content").html("<div id='album_list'></div>");
            var hotAlbums = new Albums([], { 'url': '/api/users/hot_albums/' });
            var albumListView = new AlbumListView({ 'el': $("#album_list"),
                                                   'collection' : hotAlbums,
            });
            this.currentViews = [ albumListView ];
            hotAlbums.fetch({
                success: function(a, b, c) {
                    console.log(a);                  
                    console.log(b);                  
                    console.log(c);                  
                          }
            });
            albumListView.render();
        },
        register: function() {
            if (this.user.loggedIn()) {
              Backbone.history.navigate("/", { trigger: true });
              return;
            }
            $("#content").html("<div id='register_form'></div>");
            var registerView = new RegisterUser({ 'el': $("#register_form"),
                                                   'model': this.user });
            this.currentViews = [ registerView ];
        },
        artistDetails: function(id) {
          var that = this;
          require([ 'text!templates/album.html' ], function(albumTemplate) {
            $("#content").html("<div id='artist_detail'></div><div id='album_list'></div>");
            //var albums = new Albums([], {url: '/api/users/album/?artist=' + id });
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
                       }, });
            artistView.render();
            that.currentViews = [ artistView ];
          });
        },
        adminArtist: function(id) {
          if (this.user.artist_id() != id) {
            Backbone.history.navigate('/', { trggier: true });
            return;
          }
          alert("admin artist");
          var artist = new Artist({ 'is_self': true,
            'url': '/api/users/artist_details/' + id + '/'
          });
          $("#content").html("<div id='admin_artist'></div>");
          var adminView = new ArtistAdmin({ 'el': $("#admin_artist"),
            'model': artist,
          });
          artist.fetch();
        },
        editAlbum: function(artist_id, album_id) {
          alert(artist_id + " " + album_id);
          $("#content").html("<div id='edit_abum'></div>");
          
        },
        defaultAction: function() {
            alert(Backbone.history.fragment);
        }
    });

    var initialize = function(){
        var player = PlayerView;
        var app_router = new AppRouter;
        //app_router.bind("refresh", refresh);
        app_router.user = new User();
        this.loginBox = new LoginBox({ el: $("#nav2.nav"), 'model': app_router.user });
        Backbone.history.start({ 'pushState': true });
        //refresh(app_router.user);
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
