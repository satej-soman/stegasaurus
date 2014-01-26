$(document).ready(function() {
	// capture message length
	$("#message").keydown( function(e){ 
		$("#len").text("(length: " + $("#message").val().length + ")");
		console.log("*");
	});


});