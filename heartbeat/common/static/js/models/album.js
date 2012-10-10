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
                /*song.set({ "artist": this.get("artist").name, 
                    "artist_id": this.get("artist").id,
                    "album_id": this.get("id") }); 
                    */
                song.set({ "artist": this.get("artist"),
                    "artist_id": this.get("artist_id"),
                    "album_id": this.get("id") }); 
                newsongs.push(song);
            }
            this.set({ songs: newsongs });
        }
        if (this.get('artist') && typeof this.get('artist') == "string") {
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
        response['songs'] = newsongs;
        return response; 
      },
    });
    return Album;
});
