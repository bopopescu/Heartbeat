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
        initialize: function(options) {
            _.defaults(this.options, this.defaults);
            _.bindAll(this, 'render', 'logout', 'login');
            this.model.bind('error', this.render);
            this.model.bind('change', this.render);
            this.model.bind('login', this.login);
            this.render();
        },
        events: {
            "click #logout": "logout",
            "click #username": "loadUserPage",
            "click #register": "register",
            "click #admin": "handleclick",
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
        login: function() {
          //Backbone.history.loadUrl(document.location['pathname'], { 'trigger': true });
          vent.trigger("login");
          vent.trigger("refresh");
        },
        loadUserPage: function() {

        },
        logout: function() {
          this.model.logOut();
          vent.trigger("logout");
          //Backbone.history.loadUrl(document.location['pathname'], { 'trigger': true });
        },
        register: function() {
          vent.trigger("refresh");
          //Backbone.history.navigate("/users/register/", { trigger: true });
        }
    });
    
    return LoginBox
});
