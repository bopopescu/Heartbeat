define([
    'jquery',
    'backbone',
    'song',
], function ($, Backbone, Song) {
    var Songs = Backbone.Collection.extend({
      model: Song,
      initialize: function() {
      
      },
    },
    {
      fromJSON: function(songs) {
        return "";
      },
    });
    return Songs;
});
