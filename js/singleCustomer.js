$(document).ready(function() {
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
			$("#customerTitle").html("Customer information for " + sessionStorage.getItem('id'));
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