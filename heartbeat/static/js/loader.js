define([
    'jquery'
], function($) {
    var load = function(url, callback) {
        $.ajax({
            url: url,
            success: function(resp, b, c) {
//                var load
                if (resp['redirect']) {
                    load(resp['redirect'], callback);
                } else {
                    $("#content").html(resp);
                    callback(resp, b, c, url);
                }
                
            }
        });
    }
    return {
        load: load
    };
});