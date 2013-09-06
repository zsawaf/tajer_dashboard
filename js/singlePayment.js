$(document).ready(function() {
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
			$("#paymentTitle").html("Payment information for " + sessionStorage.getItem('id'));
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