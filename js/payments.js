$(document).ready(function() {

	// initialize variables to store information.
	var payments;

	/*
	* SET UP AJAX CSRF TOKENS
	*/
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
});

// Redirect to specific payment page to show more information.
function toPaymentPage(id) {
	sessionStorage.setItem('id', id);
	window.location.replace("payment.html");
}