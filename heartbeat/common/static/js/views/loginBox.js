define([
    'jquery',
    'backbone',
    'user',
    'underscore',
    'loader',
    'text!templates/loginBoxTemplate.html',
    'util',
    'bootstrapDropdown',
    'jquery.forms',
], function ($, Backbone,  User, _, Loader, loginBoxTemplate, util) {
    LoginBox = Backbone.View.extend({
        el: $("#login_box"),
        defaults: {
            open: false,
        },
        handleclick: util.handleClick,
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
            "click #admin": "handleclick",
            //"click #username_login.dropdown-toggle": "toggle",
        },
        toggle: function(event) {
          this.open = !this.open;
          this.render();
        },
        render: function(error) {
            var template = _.template( loginBoxTemplate, {
              //'open': this.open,
              'error': this.model.get('error'),
              'username': (this.model.get('username') == null) ? "" : this.model.get('username'),
              'artist_id': this.model.get("artist_id"),
              'csrf_token': this.model.get('csrf_token')
            });
            $(this.el).html(template);
            $("#username_login").dropdown();
             
            /*if (this.open) {
              $("#login").addClass("open");
            } else {
              $("#login").removeClass("open");
            }*/
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
            Backbone.history.navigate(document.location['pathname']);
        },
        register: function() {
            Backbone.history.navigate("/users/register/", { trigger: true });
        }
    });
    
    return LoginBox
});
