define([
    'jquery',
    'backbone',
    'song',
    'artist',
], function ($, Backbone, Song, Artist) {
    var Album = Backbone.Model.extend({
      defaults: {
        title: "",
        artist: undefined,
        songs: undefined,
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
        var artist = new Artist({
          'name': album.fields.artist.fields.name,
          'bio': album.fields.artist.fields.bio,
          'pk': album.fields.artist.pk,
        })
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
          pk: album.pk,
        });
        return newalbum;
      },
    });
    return Album;
});
