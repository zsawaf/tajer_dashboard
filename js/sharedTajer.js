var global_url = "http://api.gettajer.com";
//var global_url = "http://api.lvh.me:3000"

var token = $.cookie("tajer_token");


$(document).ready(function() {

	// Clear alert box.
	// $(".alert").css("display", "none");
	// retrieve session token.

	// alert("token: "+token);
	if (!token) {
		window.location.replace("login.html");
	}
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
});


/* Logout user */

function logout() {
	$.getScript("js/cookies/jquery.cookie.js", function() {
		// remove tajer token from cookie
		$.removeCookie('tajer_token');

		// redirect to login page.
		window.location.replace("login.html");
	});
}




