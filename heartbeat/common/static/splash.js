$(function() {
  var tweet = "Demand your favorite artists when and where you want them";
  var facebooktitle = "Heartbeat: A new way to music";
  var url = "http://www.heartbeat.mx";
  $("#signup").click(function(event) {
    var email = $("#email").val();
    var emailregexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email.match(emailregexp)) {
      $("#signup").attr("disabled", "disabled");
      $(".leftbar").append("<img id='loader' src='http://heartbeatapp.s3.amazonaws.com/img/ajax-loader.gif' /></img>");
      $.ajax({
        type: 'POST',
        url: "/newsletters/mailing/subscribe/1/",
        data: {
          email: email,
        },
        success: function(a, b, c) {
          $("#loader").remove();
          $(".leftbar").html(
            "<h2>Thanks for your interest in Heartbeat</h2>" +
            "<h3>Share Heartbeat with your friends!</h3>" +
            "<div class='social-buttons'>" +
            "<a class='btn-twitter' href='http://twitter.com/share?url=" + url +
                "&text=" + tweet + "'>" +
              "<i class='icon-twitter'></i>&nbsp;Tweet</a>" +
            "<a class='btn-facebook' href='http://facebook.com/sharer.php?s=100" +
            "&p[title]=" + facebooktitle +
            "&p[summary]=Heartbeat revolutionizes how venues and artists meet, letting the fans decide where and when artists travel. Artists can bundle merch and exclusive access with tickets and venues never have an empty seat." +
            "&p[url]=http://www.heartbeat.mx'><i class='icon-facebook-sign'></i>&nbsp;Share</a>" +
            "</div>");
          console.log(a);
          console.log(b);
          console.log(c);
        },
        error: function(a, b, c) {
          $("#signup").removeAttr('disabled');
          $("#loader").remove();
          $(".leftbar").append("Sorry... that didn't work. You might want to try a different email?");
          console.log(a);
          console.log(b);
          console.log(c);

        },

      });
    } else {
      alert("Failed regexp");
    }
  });
});
