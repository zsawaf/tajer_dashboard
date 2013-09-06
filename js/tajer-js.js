$(document).ready(function() {

  var global_url = "http://api.gettajer.com";
  var token = $.cookie("tajer_token");
  if (!token)
    window.location.replace("login.html");
  var payments;

  // Set Up Ajax CSRF Tokens
  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', "Basic " + token);
    }
  });

  /*
   * ------------------------------------------------------------
   * ------------- CREATE PAYMENTS ------------------------------
   * ------------------------------------------------------------
   */

  function create_payment() {
    $("#cardNumber").on('input', function(e) {
      var type = $.payment.cardType($(this).val());
      if (type == "visa") {
	$(".cardImg").css({
	  "background-image": 'url(../img/visa.png)',
	  'background-size': 'contain',
	  "width": '32px',
	  "height": '20px',
	  "background-repeat": 'no-repeat'
	});
      } else {
	$(".cardImg").css({
	  "background-image": '',
	  'background-size': 'contain',
	  "width": '32px',
	  "height": '20px'
	});
      }
    });

    $("#paymentSubmit").click(function() {

      // first part is error checking.
      var amount = $("#amount").val();
      var cur = $("#currency").val();
      var number = $("#cardNumber").val().replace(/ /g, '');
      var cvv = $("#cvv").val();
      var expiry = $("#expiry").val()
      var splitted = expiry.split('/');
      var exp_month = splitted[0];
      var exp_year = splitted[1];

      // error check amount
      // should not be negative
      if (amount < 0) {
	$(".alert").css("display", "block");
	$(".alert").html("Amount should be a positive value");
      } else if (!amount) {
	$(".alert").css("display", "block");
	$(".alert").html("Please fill in amount");
      } else {
	// reset error
	$(".alert").css("display", "none");
      }
      // check credit card
      /* IMPLEMENT THIS LATER */
      // use jquery.payment
      // send data to server.
      var payment = {
	"amount": amount,
	"currency": cur,
	"card": {
	  "number": number,
	  "exp_month": exp_month,
	  "exp_year": exp_year,
	  "cvv": cvv
	}
      };
      $.ajax({
	url: global_url + "/v1/payments",
	data: payment,
	type: "POST",
	xhrFields: {
	  withCredentials: true
	},
	success: function(response) {
	  //console.log(response);
	  alert("payment successful");
	  window.location.replace("index.html");
	},
	error: function(message) {
	  $(".alert").css("display", "block");
	  var parsedResponse = $.parseJSON(message.responseText);
	  $(".alert").html(parsedResponse.error.message);
	}
      });
    });
  };

  function view_payments() {
    var allPayments;

    $.ajax({
      async: false,
      url: global_url + "/v1/payments",
      type: "GET",
      xhrFields: {
	withCredentials: true
      },
      success: function(response) {
	allPayments = response;
      },
      error: function(message) {
	var parsedResponse = $.parseJSON(message);
	alert(response);
      }
    });


    // Populate payment view table.
    var paymentNum = allPayments.count;
    var paymentData = allPayments.data;
    var counter = 0;
    var id;
    var customer;
    var date;
    var amount;
    var currency;
    var paid;

    while (counter < paymentNum) {
      paid = paymentData[counter].paid;
      amount = paymentData[counter].amount;
      date = new Date(paymentData[counter].created_at);
      currency = paymentData[counter].currency;
      id = paymentData[counter].id;
      // pay close attention to the use of escape characters.
      if (paid == "false") {
	$('tbody', '#viewPayments').append('<tr><td><a onclick="toPaymentPage(\'' + id + '\');">' + id + '</a></td><td class="center">' + amount + '</td><td class="center">' + currency + '</td><td class="center">' + date + '</td><td class="center"><span class="label label-warning">' + paid + '</span></td></tr>');
      } else {
	$('tbody', '#viewPayments').append('<tr><td><a onclick="toPaymentPage(\'' + id + '\');">' + id + '</a></td><td class="center">' + amount + '</td><td class="center">' + currency + '</td><td class="center">' + date + '</td><td class="center"><span class="label label-success">' + paid + '</span></td></tr>');
      }
      counter++;
    }

    $('input#cardNumber').payment('formatCardNumber');
    $('input#expiry').payment('formatCardExpiry');
    $('input#cvv').payment('formatCardCVC');
  };

  /*
   * ------------------------------------------------------------
   * ------------- Populate Single Payment Page------------------
   * ------------------------------------------------------------
   */
  $.ajax({
    url: global_url + "/v1/payments/" + sessionStorage.getItem('id'),
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    success: function(response) {
      $("#paymentTitle").html("Payment information for " + id);
      $("#date").html(response.card.exp_month + '/' + response.card.exp_year);
      $("#last4").html("Last four digits of card number: " + response.card.last4);
      if (response.description) {
	$("#description").html("Description: " + response.description);
      } else {
	$("#description").html("No description available");
      }
    },
    error: function(message) {
      var parsedResponse = $.parseJSON(message.responseText);
      //console.log(parsedResponse.error.message);
    }
  });

  /*
   * ------------------------------------------------------------
   * ------------- CUSTOMERS-------------------------------------
   * ------------------------------------------------------------
   */

  /*
   * ------------------------------------------------------------
   * ------------- CREATE CUSOMERS ------------------------------
   * ------------------------------------------------------------
   */
  $("#customerSubmit").click(function() {

    // first part is error checking.
    var name = $("#name").val();
    var email = $("#email").val();
    var desc = $("#description").val();
    var num = $("#cardNo").val();
    var exp_m = $("#m").val();
    var exp_y = $("#y").val();
    var c = $("#c").val();

    // check credit card
    /* IMPLEMENT THIS LATER */

    // send data to server.
    var customer = {
      "email": email,
      "name": name,
      "description": desc,
      "card": {
	"number": num,
	"exp_month": exp_m,
	"exp_year": exp_y,
	"cvv": c
      }
    };
    $.ajax({
      url: global_url + "/v1/customers",
      data: customer,
      type: "POST",
      xhrFields: {
	withCredentials: true
      },
      success: function(response) {
	//console.log(response);
	alert("customer created");
	window.location.replace("customers.html");
      },
      error: function(message) {
	$(".alert").css("display", "block");
	var parsedResponse = $.parseJSON(message.responseText);
	$(".alert").html(parsedResponse.error.message);
      }
    });
  });

  /*
   * ------------------------------------------------------------
   * ------------- POPULATE CUSTOMER PAGE -----------------------
   * ------------------------------------------------------------
   */
  var allCustomers;
  $.ajax({
    async: false,
    url: global_url + "/v1/customers",
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    success: function(response) {
      allCustomers = response;
    },
    error: function(message) {
      var parsedResponse = $.parseJSON(message);
      alert(response);
    }
  });

  var count = allCustomers.count;
  var i = 0;
  if (count > 0) {
    var id = allCustomers.data[0].id;
    var email = allCustomers.data[0].email;
    while (i < count) {
      $('tbody', '#viewCustomers').append('<tr><td><a onclick="toCustomerPage(\'' + id + '\');">' + id + '</a></td><td class="center">' + email + '</td></tr>');
      i++;
    }
  }

  /*
   * ------------------------------------------------------------
   * ------------- Populate Single Customer Page-----------------
   * ------------------------------------------------------------
   */
  $.ajax({
    url: global_url + "/v1/customers/" + sessionStorage.getItem('id'),
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    success: function(response) {
      // customer section
      $("#customerTitle").html("Customer information for " + id);
      $("#name").html("Name: " + response.name);
      $("#email").html("Email: " + response.email);
      $("#created").html("Created: " + response.created);

      //card section
      $("#date").html(response.card.exp_month + '/' + response.card.exp_year);
      $("#last4").html("Last four digits of card number: " + response.card.last4);
      if (response.description) {
	$("#description").html("Description: " + response.description);
      } else {
	$("#description").html("No description available");
      }
    },
    error: function(message) {
      var parsedResponse = $.parseJSON(message.responseText);
      //console.log(parsedResponse.error.message);
    }
  });

});


function logout() {
  $.getScript("js/cookies/jquery.cookie.js", function() {
    $.removeCookie('tajer_token');
    window.location.replace("login.html");
  });
}

function toPaymentPage(id) {
  sessionStorage.setItem('id', id);
  window.location.replace("payment.html");
}

function toCustomerPage(id) {
  sessionStorage.setItem('id', id);
  window.location.replace("customer.html");
}
