define([
    'jquery',
    'backbone',
    'user',
    'underscore',
    'loader',
    'text!templates/loginBoxTemplate.html',
    'util',
    'vent',
    'bootstrapDropdown',
    'jquery.forms',
], function ($, Backbone,  User, _, Loader, loginBoxTemplate, util, vent) {
    LoginBox = Backbone.View.extend({
        el: $("#login_box"),
        handleclick: util.handleClick,
        defaults: {
          open: false,
        },
        initialize: function(options) {
            this.options = _.extend(this.defaults, this.options);
            _.bindAll(this, 'render', 'logout', 'login');
            this.model.bind('error', this.render);
            this.model.bind('change', this.render);
            this.model.bind('login', this.login);
            this.render();
        },
        events: {
            "click #logout": "logout",
            "click #username": "handleclick",
            "click #register": "register",
            "click #admin": "handleclick",
            "click #features": "handleclick",
        },
        render: function(error) {
            var template = _.template( loginBoxTemplate, this.model.toJSON()); 

            $(this.el).html(template);
            $("#username_login").dropdown();
            // Used for rerendering after an unsuccessful attempt
            if (this.options.open) {
              $("#login").addClass("open");
              this.options.open = false;
            } 
            var user = this.model;
            var that = this;
            $(this.el).find("form").ajaxForm({
                success: user.logIn,
                beforeSend: function(xhr, a, b, c) {
                    console.log(xhr);
                    console.log(a);
                    console.log(b);
                    console.log(c);
                },
                error: function(xhr, textStatus, error) {
                  console.log(xhr);
                  console.log(textStatus);
                  console.log(error);
                  var errors = $.parseJSON(xhr.responseText)['form_errors']
                  that.options.open = true;
                  user.set({ 'error': errors['__all__'] });
                },
            });
        },
        login: function() {
          vent.trigger("login");
          vent.trigger("refresh");
        },
        logout: function() {
          this.model.logOut();
          vent.trigger("logout");
        },
        register: function() {
          Backbone.history.navigate("/accounts/register/", { trigger: true });
          return false;
        }
    });
    
    return LoginBox
});
