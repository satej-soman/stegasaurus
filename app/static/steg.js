$(document).ready(function() {
	$("#message").keydown( function(e){ 
		$("#len").text("(length: " + $("#message").val().length + ")");
		console.log("*");
	});
});