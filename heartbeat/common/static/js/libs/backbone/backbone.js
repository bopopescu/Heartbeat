define(['libs/backbone/backbone-min'], function(){
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
