define([
    'jquery',
    'backbone',
    'user',
    'underscore',
    'text!templates/registerUserTemplate.html',
    'jquery.forms',
    'jquery.overlay',
], function($, Backbone, User, _, registerTemplate) {
  var isOpen = false;
  var registerUserClick = false;
  RegisterUser = Backbone.View.extend({
    el: $("#register_form"),
    defaults: {
      username: "",
      email: "",
      password1: "",
      password2: "",
      name: "",
      bio: "",
      username_error: "",
      password_error: "",
      password2_error: "",
      email_error: "",
      name_error: "",
      bio_error: "",
      error: "",
      is_artist: false,
    },
    events: {
      "click #artist": "toggleArtist",
      "input input": "captureInput",
    },
    initialize: function(options) {
      this.options = _.extend(this.defaults, this.options);
      _.bindAll(this, 'render', 'open', 'submit');
      $(this.el).css({
        background: '#EDEDED',
        'padding-top': '20px',
        display: "none",
        width: '450px',
        'margin': '0 auto',
      });
      isOpen = false;
      var close = this.close;
      $("body").die("click").live("click", function () {
        if (isOpen && !registerUserClick) {
          close();
          return false;
        } else if (registerUserClick) {
          registerUserClick = false;
          return false;
        }
      });
      $(this.el).click(function(event) {
        event.stopPropagation();
      });
      this.render();
    },
    captureInput: function(event) {
      this.options[event.currentTarget.id] = event.currentTarget.value;
    },
    toggleArtist: function() {
      this.options.is_artist = !this.options.is_artist;
      this.render();
    },
    render: function() {
      $(this.el).html(_.template(registerTemplate, this.options))
      if (!isOpen) {
        this.open();
      }
      $(this.el).children("form").css({
        width: '400px',
        'margin': '0 auto',
      })
      if (!this.options.is_artist) {
        $(this.el).find("#artist_name_box").hide();
        $(this.el).find("#artist_bio_box").hide();
      }
      $(this.el).children("form").die("submit").submit(this.submit);
      isOpen = true;
      registerUserClick = true;
    },
    open: function() {            
      var form = $(this.el).children("form");
      $("body").css({
        "height": "100%",
        "min-height": "100%",
      });
      $("#content_container").css({
        "height": '100%',
        "min-height": "100%",
      });
      $(this.el).fadeIn("slow");
    },
    submit: function() {
      var that = this;
      var user = this.model;
      var form = $(this.el).children("form");
      $.ajax({
        type: 'POST',
        url: '/accounts/register/',
        contentType: "application/json",
          dataType: "json",
          data: {
            username: that.options.username,
            email: that.options.email,
            password1: that.options.password1,
            password2: that.options.password2,
            artist: that.options.is_artist,
            name: that.options.name,
            bio: that.options.bio,
          },
          beforeSend: function(a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
          },
          success: function(response, textStatus, c) {
              var artistId = -1;
              if (response['artistId']) {
                artistId = parseInt(response['artistId']);
              }
              var isArtist = (artistId > 0);
              that.model.set({
                username: that.options.username,
                artistId: artistId,
                isArtist: isArtist,
                loggedin: true,
              });
              that.model.trigger("login");
              Backbone.history.navigate("/", { trigger: true });
          },
          error: function(xhr, textStatus, errorThrown) {
            var errors = $.parseJSON(xhr.responseText)['form_errors'];
            that.options.username_error = this.undefinedOrDefault(errors['username'], "");
            that.options.email_error = this.undefinedOrDefault(errors['email'], "");
            that.options.password_error = this.undefinedOrDefault(errors['password1'], "");
            that.options.password2_error = this.undefinedOrDefault(errors['password2'], "");
            that.options.error = this.undefinedOrDefault(errors['__all__'], "");
            that.render();
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
          },
          undefinedOrDefault: function(val, defaultVal) {
            return (val === undefined) ? defaultVal : val[0];
          }
        }); 
      return false;
    },
    close: function() {
      $("body").css({
        "opacity": 1,
      });
      Backbone.history.navigate("/", { trigger: true });
      isOpen = false;
    }
  });
  return RegisterUser;
});
