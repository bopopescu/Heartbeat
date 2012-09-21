define([
    'jquery',
    'backbone',
    'underscore',
], function ($, Backbone, _) {
    BaseUserView = Backbone.View.extend({
        
        

        initialize: function() {
            
            Backbone.View.prototype._configure.apply(this, arguments);
        },

        logout: function() {
            this.model.logOut();
            this.options.content.load(document.location['pathname']);
        },
        logIn: function(response, status, xhr, form) {
            if (this.user.logIn(response, status, xhr, form)) {
                return true;
            } else {
                return false;   
            }
        }
    });
});