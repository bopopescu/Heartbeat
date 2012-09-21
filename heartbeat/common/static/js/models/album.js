define([
    'jquery',
    'backbone',
    'song',
], function ($, Backbone, Song) {
    var Album = Backbone.Model.extend({
      defaults: {
        title: "",
        artist: {},
        songs: [],
      },
      initialize: function(options) {
        this.songs = [];
      },
    },
    {
      fromJSON: function(album) {
        var songs = album.extras.songs;
        songs = $.parseJSON(songs);
        //songsCollection = Songs();
        var artist = {
          'name': album.fields.artist.fields.name,
          'bio': album.fields.artist.fields.bio,
          'id': album.fields.artist.pk,
        }
        var songsCollection = [];
        var newalbum = new Album();
        for (var i = 0; i < songs.length; i++) {
          var song = Song.fromJSON(songs[i], newalbum); 
          songsCollection.push(song);
        }
        newalbum.set({
          title: album.fields.title,
          songs: songsCollection,
          cover: album.fields.cover,
          release_date: album.fields.release_date,
          artist: artist,
          id: album.pk,
        });
        return newalbum;
      },
    });
    return Album;
});
