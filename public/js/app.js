var socket = io();

var $form = $("#message-form");
var $messageInput = $("input[name=message]");
var $chat = $("#chat");

socket.on("connect", function() {
	console.log("Connected to Socket.io server!");
});

socket.on("message", function (data){
	console.log("New message: " + data.text);

	$chat.append("> " + data.text + "<br>");
});

// Handles submitting of new message

$form.on("submit", function (event){
	event.preventDefault();

	socket.emit("message", {
		text: $messageInput.val()
	});

	$messageInput.val("");
});