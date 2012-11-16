define(['jquery',
    'underscore',
    'backbone',
    'text!templates/donate.html',
    'stripe',
], function($, _, Backbone, donateTmpl, Stripe) {
  var DonationView = Backbone.View.extend({
    events: {
      "submit form": 'submit',
    },
    initialize: function(options) {
      _.bindAll(this, "render", "submit", 'responseHandler');
      this.options.errors = {};
      this.options.donation = -1;
      Stripe.setPublishableKey('pk_test_dEMiu7zuEzsiEwThG8QCN6BJ');
    },
    render: function() {
      $(this.el).html(_.template(donateTmpl, this.options))
    },
    submit: function(e) {
      e.preventDefault();
      var donation = $(".donation").val();
      donation = parseInt(parseFloat(donation)*100)/100;
      if (donation < 1) {
        this.responseHandler({}, {error: {param: 'donation', message: 'You must donate at least $1'}});
        return;
      }
      this.options.donation = donation;
      this.options.errors = {}
      $(".submit-button").attr("disabled", "disabled");
      Stripe.createToken({
        number: $(".card-number").val(),
        cvc: $('.card-cvc').val(),
        exp_month: $('.card-expiry-month').val(),
        exp_year: $('.card-expiry-year').val(),
      }, this.responseHandler);
      return false;
    },
    responseHandler: function(status, response) {
      if (response.error) {
        this.options.errors[response.error.param] = response.error.message;
        this.render();
      } else {
        var form = $("#payment-form");
        var token = response['id'];
        form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        form.get(0).submit(); 
      }

    },
  });
  return DonationView;
});
