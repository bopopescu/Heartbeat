
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery',
        'underscore': 'libs/underscore/underscore',
        'backbone': 'libs/backbone/backbone',
        'templates': '../templates',
        'bootstrap': 'libs/bootstrap/bootstrap',
        'bootstrapDropdown': 'libs/bootstrap/bootstrap-dropdown',
        'jquery.forms': 'libs/form/jquery.form',
        'timeSelect': 'libs/timeselect/ptTimeSelect',
        'jquery.overlay': 'libs/overlay/jquery.overlay.min',
        'timeago': 'libs/timeago/timeago',
        'gallery': 'libs/gallery/jquery.gallery.0.3.min',
        'jquery.jplayer': 'libs/jPlayer/jquery.jplayer.min',
        'user': 'models/user',
        'song': 'models/song',
        'songs': 'models/songs',
        'album': 'models/album',
        'albums': 'models/albums',
        'artist': 'models/artist',
        'player': 'models/queue',
        'loginBox': 'views/loginBox',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
//            exports: 'Backbone'
        },
/*        'user': {
            deps: [ 'backbone', 'jquery', 'underscore' ]
        },
        'song': {
            deps: ['underscore', 'backbone', 'jquery']
        },
        'songs': {
            deps: ['underscore', 'backbone', 'jquery', 'song']
        },
        'album': {
        deps: ['underscore', 'backbone', 'jquery', 'song']
        },
        'albums': {
            deps: ['underscore', 'backbone', 'jquery', 'album']
        },
        'loginBox': ['underscore', 'backbone', 'jquery', 'user'],
        */
        'jquery.form': ['jquery'],
        'jquery.jplayer': ['jquery'],
        'jquery.timeselect': ['jquery'],
        'bootstrap': ['jquery'],
        'bootstrapDropdown': ['bootstrap', 'jquery'],
        'timeago': ['jquery'],
        'gallery': ['jquery'],
    },
});

require([
    'app',
], function(App) {
    App.initialize();
});
