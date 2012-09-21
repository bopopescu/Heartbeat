define([
    'jquery',
    'backbone',
    'user',
    'underscore',
    'loader',
    'text!templates/loginBoxTemplate.html',
    'bootstrapDropdown',
    'jquery.forms',
], function ($, Backbone,  User, _, Loader, loginBoxTemplate) {
    LoginBox = Backbone.View.extend({
        el: $("#login_box"),
        defaults: {
            content: $("#content"),
            open: false,
        },
        initialize: function(options) {
            _.defaults(this.options, this.defaults);
            _.bindAll(this, 'render', 'toggle', 'logout');
            this.model.bind('error', this.render);
            this.model.bind('change', this.render);
            this.render();
        },
        events: {
            "click #logout": "logout",
            "click #username": "loadUserPage",
            "click #register": "register",
            "click #username_login.dropdown-toggle": "toggle",
        },
        toggle: function(event) {
          this.open = true;
        },
        render: function(error) {
            var template = _.template( loginBoxTemplate, {
              'open': this.open,
              'error': this.model.get('error'),
              'username': (this.model.get('username') == null) ? "" : this.model.get('username'),
              'csrf_token': this.model.get('csrf_token')
            });
            $(this.el).html(template);
            var user = this.model;
            $(this.el).find("form").ajaxForm({
                success: user.logIn,
                beforeSend: function(xhr, a, b, c) {
                    console.log(xhr);
                    console.log(a);
                    console.log(b);
                    console.log(c);
                },
            });
        },
        loadUserPage: function() {

        },
        logout: function() {
            this.model.logOut();
            // Check to see if we have to redirect the user
            Loader.load(document.location['pathname'], function(resp, b, c, newurl) {
                Backbone.history.navigate(newurl, {trigger: true});
            });
        },
        register: function() {
            Backbone.history.navigate("/users/register/", { trigger: true });
        }
    });
    
    return LoginBox
});
