define([
    'jquery',
    'underscore',
    'backbone',
    'loader',
    'user',
    'albums',
    'artist',
    'loginBox',
    'views/loginView',
    'views/registerUser',
    'views/albumListView',
    'views/artistDetail',
    'views/playerView',
    'jquery.jplayer',
], function($, _, Backbone, Loader, User, Albums, Artist, LoginBox, LoginView, RegisterUser,
           AlbumListView, ArtistDetailView, PlayerView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'users/login/': 'showLogin',
            'users/register/': 'register',
            '': 'showArtists',
            'artists/': 'showArtists',
            'artists/:id/': 'artistDetails',
            "*actions": 'defaultAction'
        },
        showLogin: function(){
            if (this.user.loggedIn()) {
              Backbone.history.navigate("/", { trigger: true });
              return;
            }
            $("#content").html("<div id='login_form'></div>");
            this.loginView = new LoginView({ 
                'model': this.user,
                'el': $("#login_form")
            }).render();
        },
        showArtists: function(){
            $("#content").html("<div id='album_list'></div>");
            var hotAlbums = new Albums([], { 'url': '/api/users/hot_albums/' });
            this.albumListView = new AlbumListView({ 'el': $("#album_list"),
                                                   'collection' : hotAlbums,
            });
            hotAlbums.fetch({
                success: function(a, b, c) {
                    console.log(a);                  
                    console.log(b);                  
                    console.log(c);                  
                          }
            });
            this.albumListView.render();
        },
        register: function() {
            if (this.user.loggedIn()) {
              Backbone.history.navigate("/", { trigger: true });
              return;
            }
            $("#content").append("<div id='register_form'></div>");
            this.registerView = new RegisterUser({ 'el': $("#register_form"),
                                                   'model': this.user });
        },
        artistDetails: function(id) {
          require([ 'text!templates/album.html' ], function(albumTemplate) {
            $("#content").html("<div id='artist_detail'></div><div id='album_list'></div>");
            var albums = new Albums([], {url: '/api/users/album/?artist=' + id });
            var artist = new Artist({ 'url': '/api/users/artist_details/' + id + '/' });
            this.artistView = new ArtistDetailView({ 'el': $("#artist_detail"),
                                             'model': artist,
            });
            /*var albumListView = new AlbumListView({ 'el': $("#album_list"),
              'collection': albums,
              'template': albumTemplate,
            });*/
            //albums.fetch();
            artist.fetch();
          });
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
