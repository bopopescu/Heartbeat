({
  baseUrl: ".",
  paths: {
    'requireLib': 'libs/require/require',
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
    'jquery.filedownload': 'libs/jquery.filedownload/jquery.filedownload',
    'formset': 'libs/formset/jquery.formset',
    'modernizr': 'libs/modernizr/modernizr.min',
    'stripe': 'https://js.stripe.com/v1/?',
    'user': 'models/user',
    'song': 'models/song',
    'songs': 'models/songs',
    'album': 'models/album',
    'albums': 'models/albums',
    'artist': 'models/artist',
    'player': 'models/queue',
    'follow': 'models/follow',
    'offer': 'models/offer',
    'features': 'models/features',
    'feature': 'models/feature',
    'loginBox': 'views/loginBox',
  },
  name: "main",
  out: "../built/main-built.js",
  include: "requireLib",
})
