define(['jquery', 'underscore', 'libs/backbone/backbone-min'], function($, _){
    _.noConflict();
    $.noConflict();
    Backbone.Collection.prototype.parse = function( data ) {
      if ( data && data.meta ) {
        this.meta = data.meta;
       }

       return data && data.objects;
    };
    return Backbone.noConflict();
});
