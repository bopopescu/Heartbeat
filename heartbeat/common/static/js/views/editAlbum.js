define([
    'jquery',
    'underscore',
    'backbone',
    'album',
    'text!templates/editAlbum.html',
    'modernizr',
    'jquery-ui',
    'datepicker',
    'formset',
    'bootstrap-fileupload',
    'jquery.forms',
], function($, _, Backbone, Album, editAlbumTemplate, Modernizr) {
  var EditAlbum = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, 'render');
      this.model.bind("change", this.render);
      jQuery.event.props.push('dataTransfer');
      this.initial = 0;
      this.setinitial = true;
    },
    render: function() {
      if (this.setinitial) {
        this.initial = this.model.get("songs").length;
        this.setinitial = false;
      }
      this.model.attributes['initial'] = this.initial;
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
        added: function(row) {
          that.model.addSong();
          $(row).find("input[id$=track_num]").val(that.model.songCount());
          $(row).find(".track_num").html(that.model.songCount());
          $(row).find("input[name$=id]").val('');
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
        headers: {
          "X-HTTP-Method-Override": "PUT",
          'HTTP-X-HTTP-Method-Override': 'PUT',
          'HTTP_X_HTTP_METHOD_OVERRIDE': 'PUT',
        },
        success: function(responseText, status, xhr, form) {
          Backbone.history.navigate("/artists/" + that.model.get("artist_id") + "/", { trigger: true });
        },
        error: function(a,b,c) {
          console.log(a);
          console.log(b);
          console.log(c);
        },
        beforeSend: function(a,b,c) {
          console.log(a);
          console.log(b);
          console.log(c);
        },
      });
    },
  });
  return EditAlbum;
});
