
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery',
        'underscore': 'libs/underscore/underscore',
        'backbone': 'libs/backbone/backbone',
        'templates': '../templates',
        'bootstrap': 'libs/bootstrap/bootstrap',
        'bootstrapDropdown': 'libs/bootstrap/bootstrap-dropdown',
        'bootstrap-fileupload': 'libs/bootstrap/bootstrap-fileupload',
        'jquery.forms': 'libs/form/jquery.form',
        'jquery.timeselect': 'libs/timeselect/jquery.ptTimeSelect',
        'datepicker': 'libs/bootstrap-datepicker/bootstrap-datepicker',
        'jquery.overlay': 'libs/overlay/jquery.overlay.min',
        'timeago': 'libs/timeago/timeago',
        'gallery': 'libs/gallery/jquery.gallery.0.3.min',
        'jquery.jplayer': 'libs/jPlayer/jquery.jplayer.min',
        'jquery-ui': 'libs/jquery/jquery-ui-1.9.0.custom.min',
        'jquery.cookie': 'libs/jquery.cookie/jquery.cookie',
        'formset': 'libs/formset/jquery.formset.min',
        'modernizr': 'libs/modernizr/modernizr.min',
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
        'jquery-ui': ['jquery'],
        'jquery.jplayer': ['jquery'],
        'jquery.timeselect': ['jquery'],
        'jquery.cookie': ['jquery'],
        'formset': ['jquery'],
        'datepicker': ['jquery'],
        'bootstrap': ['jquery'],
        'bootstrapDropdown': ['bootstrap', 'jquery'],
        'bootstrap-fileupload': ['bootstrap', 'jquery'],
        'timeago': ['jquery'],
        'gallery': ['jquery'],
    },
});

require([
    'app',
], function(App) {
    App.initialize();
});
