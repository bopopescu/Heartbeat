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
      url: function() {
        return '/api/users/albums/' + this.get('id') + '/';
      },
      initialize: function(options) {
        if (options && options.hasOwnProperty("songs") && options.songs instanceof Array) {
            var songs = options.songs;
            var newsongs = [];
            for (var i = 0; i < songs.length; i++) {
                var song;
                if (songs[i] instanceof Backbone.Model) {
                    song = songs[i];
                } else {
                    song = new Song(songs[i]);
                }
                song.set({ "artist": this.get("artist"),
                    "artist_id": this.get("artist_id"),
                    "album_id": this.get("id") }); 
                newsongs.push(song);
            }
            this.set({ songs: newsongs });
        }
        if (this.get('artist') && !this.get('artist_id') && typeof this.get('artist') == "string") {
          var urlParts = this.get('artist').split('/');
          this.set({ artist_id: urlParts[urlParts.length - 2] });
        }
      },
      parse: function(response) {
        console.log(response);
        var songs = response.songs;
        var newsongs = [];
        for (var i = 0; i < songs.length; i++) {
           newsongs.push(new Song(songs[i])); 
        }
        var artistname = response['artist'].name;
        response['artist_id'] = response['artist'].id;
        delete response['artist']
        response['artist'] = artistname;
        response['songs'] = newsongs;
        if (response['release_date'] && response['release_date'].indexOf('-') != -1) {
          var dates = response["release_date"].split('-');
          response['release_date'] = dates[1] + '/' + dates[2] + '/' + dates[0];
        }
        return response; 
      },
      /* Moves song at @beginindex to @endindex */
      reorderSong: function(beginindex, endindex) {
        var songs = this.get("songs");
        var removed = songs.splice(beginindex, 1)[0];
        songs.splice(endindex, 0, removed);
        this.trigger("change");
      },
      setReleaseDate: function(date) {
        this.set({ 'release_date': date });
      },
      songCount: function() {
        return this.get("songs").length;
      },
      addSong: function() {
        var song = new Song({ track_num: this.songCount() });
        this.get("songs").push(song);
        this.trigger("change");
      },
      removeSong: function(index) {
        this.get("songs").splice(index, 1);
        _.each(this.get("songs"), function(song, index) {
          song.attributes['track_num'] = index;
        });
        this.trigger("change");
      },
      setName: function(index, name) {
        this.get("songs")[index].attributes['name'] = name;
        this.trigger("change");
      },
    });
    return Album;
});
