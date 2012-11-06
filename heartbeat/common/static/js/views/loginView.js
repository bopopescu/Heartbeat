define([
    'jquery',
    'backbone',
    'loader',
    'user',
    'underscore',
    'text!templates/loginViewTemplate.html',
    'jquery.forms',
], function ($, Backbone,  Loader, User, _, loginViewTemplate) {
    LoginView = Backbone.View.extend({
        el: $("#login_box"),
        defaults: {
            content: $("#content"),
        },
        initialize: function(options) {
            _.defaults(this.options, this.defaults);
            _.bindAll(this, 'render', 'logIn')

            this.model.bind('change', this.render);
            this.model.bind('error', this.displayError);
            this.model.bind('login', this.login);
            this.render()
        },
        render: function() {
            var template = _.template( loginViewTemplate, {
                'username': (this.model.get('username') == null) ? "" : this.model.get('username'),
                'csrf_token': this.model.get('csrf_token')
            });
            $(this.el).html(template);
            var user = this.model;
            var self = this;
            $(this.el).find("form").ajaxForm({
                success: self.logIn,
            });
        },
        logIn: function(response, status, xhr, form) {
          this.model.logIn(response, status, xhr, form);
        },
        login: function() {
          Backbone.history.navigate('/', {trigger: true });
         },
    });
    
    return LoginView;
});
