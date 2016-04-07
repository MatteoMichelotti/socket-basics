var socket = io();

socket.on("connect", function() {
	console.log("Connected to Socket.io server!");
});

socket.on("message", function (data){
	console.log("New message: " + data.text);
});

// Handles submitting of new message
var $form = $("#message-form");
var $messageInput = $("input[name=message]");

$form.on("submit", function (event){
	event.preventDefault();

	socket.emit("message", {
		text: $messageInput.val()
	});

	$messageInput.val("");
});