/* This script contains functions used in customers.html and
* customer.html */

$(document).ready(function() {
	
	
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
});

/* Redirect to customer page and store @param id into session */
function toCustomerPage(id) {
	sessionStorage.setItem('id', id);
	window.location.replace("customer.html");
}
