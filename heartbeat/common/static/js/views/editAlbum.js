define([
    'jquery',
    'underscore',
    'backbone',
    'album',
    'text!templates/editAlbum.html',
    'modernizr',
    'song',
    'jquery-ui',
    'datepicker',
    'formset',
    'bootstrap-fileupload',
    'jquery.forms',
], function($, _, Backbone, Album, editAlbumTemplate, Modernizr, Song) {
  var EditAlbum = Backbone.View.extend({
    events: {
      "change #id_title": "setTitle",
    },
    initialize: function(options) {
      _.bindAll(this, 'render', 'setTitle', 'displayerror');
      this.model.bind("change", this.render);
      this.initial = 0;
      this.setinitial = true;
    },
    render: function() {
      if (this.setinitial) {
        this.initial = this.model.get("songs").length;
        this.model.attributes['initial'] = this.initial;
        this.setinitial = false;
        if (this.initial == 0) {
          this.model.attributes['songs'] = [new Song,new Song,new Song] 
        }
      }
      $(this.$el).html(_.template(editAlbumTemplate, this.model.toJSON()));
      var albumList = $("#sortable_album");
      var that = this;
      albumList.sortable({
        handle: $(".icon-move"),
        update: function(event, ui) {
          that.model.reorderSong(parseInt(ui.item.attr('id')), albumList.children().index(ui.item))
        }
      });
      $(".date").datepicker()
        .on('changeDate', function(event) {
          $(".date").datepicker("hide");
          that.model.setReleaseDate($(this).data().date);
        });
      $(".song ").formset({
        deleteText: "",
        deleteCssClass: "delete",
        added: function(row) {
          that.model.addSong();
          $(row).find("input[id$=track_num]").val(that.model.songCount());
          $(row).find(".track_num").html(that.model.songCount());
          $(row).find("input[name$=id]").val('');
          $(row).find(".fileupload-preview.uneditable-input").html('');
        },
        removed: function(row) {
          that.model.removeSong(parseInt(row.attr('id')));
        }
      });
      // Maybe implement drag and drop file upload in the future
      /*if (Modernizr.draganddrop) {
        $(".dropable").bind("drop", function(event) {
          var file = event.dataTransfer.files[0];
          
        });
      }*/
      $(".fileupload").fileupload();
      $("input[name$=name]").bind('change', function(event) {
        that.model.setName(parseInt($(event.currentTarget).parent().attr("id")), 
          $(event.currentTarget).val());
      });
      this.$el.find("form").ajaxForm({
        contentType: 'application/json',
        success: function(responseText, status, xhr, form) {
          Backbone.history.navigate("/artists/" + that.model.get("artist_id") + "/", { trigger: true });
        },
        error: that.displayerror,
      });
    },
    setTitle: function(event) {
      this.model.setTitle($(event.currentTarget).val());
    },
    displayerror: function(xhr, textStatus, error) {
      console.log(xhr);
      console.log(textStatus);
      console.log(error);
      var errors = $.parseJSON(xhr.responseText)['errors'];
      console.log(errors);
      this.model.set({ 'album_errors': errors['album_errors'],
        'song_errors': errors['song_errors']
      });
    },
  });
  return EditAlbum;
});
