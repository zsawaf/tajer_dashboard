
$(document).ready(function() {
	
	// Clear alert box.
	$(".alert").css("display", "none");
	
	// retrieve session token.
	var token = $.cookie("tajer_token");
	
	alert(token);
	
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
	$("#paymentSubmit").click(function(){
		// first part is error checking.
		var amount = $("#amount").val();
		var cur = $("#currency").val();
		var number = $("#cardNumber").val();
		var exp_month = $("#month").val();
		var exp_year = $("#year").val();
		var cvv = $("#cvv").val();
		
		// error check amount
		// should not be negative
		if (amount < 0) {
			$(".alert").css("display", "block");
			$(".alert").html("Amount should be a positive value");
		}
		else if (!amount){
			$(".alert").css("display", "block");
			$(".alert").html("Please fill in amount");
		}
		else {
			// reset error
			$(".alert").css("display", "none");
		}
		// check credit card
		/* IMPLEMENT THIS LATER */

		// send data to server.

		var payment = {"amount": amount, "currency": cur, "card":{"number": number, "exp_month": exp_month, "exp_year": exp_year, "cvv": cvv}};
		$.ajax({
			url: "http://api.lvh.me:3000/v1/payments",
			data: payment,
			type: "POST",
			xhrFields: {
				withCredentials: true
			},
			success: function(response){
		        console.log(response);
				alert("payment successful");
			},
			error: function(message){
				$(".alert").css("display", "block");
				var parsedResponse = $.parseJSON(message.responseText);
				$(".alert").html(parsedResponse.error.message);
			}
		});
	});
	
	var allPayments;
	
	$.ajax({
		async: false,
		url: "http://api.lvh.me:3000/v1/payments",
		type: "GET",
		xhrFields: {
			withCredentials: true
		},
		success: function(response){
			allPayments = response;
		},
		error: function(message){
			var parsedResponse = $.parseJSON(message);
	        alert(response);
		},
		error: function(message){
			var parsedResponse = $.parseJSON(message.responseText);
			alert(parsedResponse.error.message);
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
		date = paymentData[counter].created_at;
		currency = paymentData[counter].currency;
		id = paymentData[counter].id;
		$('tbody', '#viewPayments').append(					
			'<tr><td>'+id+'</td><td class="center">'+amount+'</td><td class="center">'+currency+'</td><td class="center">'+date+'</td><td class="center"><span class="label label-warning">'+paid+'</span></td></tr>'
		);
		counter++;
	}
});


/* Logout user */
function logout(){
	$.getScript("js/cookies/jquery.cookie.js", function(){
		// remove tajer token from cookie
	    $.removeCookie('tajer_token');	
	
		// redirect to login page.
		window.location.replace("login.html");	
	});
}


