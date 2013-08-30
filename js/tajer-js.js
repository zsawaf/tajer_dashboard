
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
	
	$.ajax({
		url: "http://api.lvh.me:3000/v1/payments",
		type: "GET",
		xhrFields: {
			withCredentials: true
		},
		success: function(response){
	        alert(response);
		},
		error: function(message){
			var parsedResponse = $.parseJSON(message.responseText);
			alert(parsedResponse.error.message);
		}
	});
	
	$('tbody', '#viewPayments').html(
		'<tr><td>Ajith Hristijan</td><td class="center">2012/03/01</td><td class="center">Member</td><td class="center"><span class="label label-warning">Pending</span></td><td class="center"><a class="btn btn-success" href="#"><i class="icon-zoom-in "></i></a><a class="btn btn-info" href="#"><i class="icon-edit "></i></a><a class="btn btn-danger" href="#"><i class="icon-trash "></i></a></td></tr>'
	);
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


