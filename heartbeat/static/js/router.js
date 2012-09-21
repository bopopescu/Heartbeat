define([
    'jquery',
    'underscore',
    'backbone',
    'loader',
    'user',
    'albums',
    'loginBox',
    'views/loginView',
    'views/registerUser',
    'views/albumListView',
], function($, _, Backbone, Loader, User, Albums, LoginBox, LoginView, RegisterUser,
           AlbumListView) {
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
            var hotAlbums = new Albums();
            this.albumListView = new AlbumListView({ 'el': $("#album_list"),
                                                     'collection' : hotAlbums });
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
        artistDetails: function() {
          $("#content").html("Hey!");
        },
        defaultAction: function() {
            alert(Backbone.history.fragment);
        }
    });

    var initialize = function(){
        var app_router = new AppRouter;
        //app_router.bind("refresh", refresh);
        app_router.user = new User();
        this.loginBox = new LoginBox({ 'model': app_router.user });
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
