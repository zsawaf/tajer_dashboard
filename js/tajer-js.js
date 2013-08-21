
$(document).ready(function() {
	
	// Clear alert box.
	$(".alert").css("display", "none");
	
	// retrieve session token.
	var token = $.cookie("tajer_token");
	
	// initialize variables to store information.
	var payments;
	
	/*
	* SET UP AJAX CSRF TOKENS
	*/
	$.ajaxSetup({
	    beforeSend: function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', token);
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
	
	// Get basic user information from server.
	/*
	$.ajax({
		url: "http://api.lvh.me:3000/v1/accounts/login",
		data: cred,
		type: "POST",
		xhrFields: {
			withCredentials: true
			},
	    beforeSend: function(xhr) {
	    	xhr.setRequestHeader("Authorization", "Basic " + token);
	  	},
		success: function(response){
	        console.log(response);
			payments = response;
		},
		error: function(message){
			alert("retrieving customers failed.");
		}
	});
	*/
});

/* Logout user */
function logout(){
	$.getScript("js/cookies/jquery.cookie.js", function(){
		alert("user clicked logout");
		// remove tajer token from cookie
	    $.removeCookie('tajer_token');	
	
		// redirect to login page.
		window.location.replace("login.html");	
	});
}


