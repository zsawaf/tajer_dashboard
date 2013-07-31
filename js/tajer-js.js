
$(document).ready(function() {
	// retrieve session token.
	var token = $.cookie("tajer_token");
	
	// initialize variables to store information.
	var payments;
	
	// Get basic user information from server.
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

