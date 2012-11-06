define(['libs/backbone/backbone-min'], function($, _){
    Backbone.Collection.prototype.parse = function( data ) {
      if ( data && data.meta ) {
        this.meta = data.meta;
       }

       return data && data.objects;
    };
    return Backbone.noConflict();
});
