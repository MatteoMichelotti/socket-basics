var socket = io();

var $form = $("#message-form");
var $messageInput = $("input[name=message]");
var $chat = $("#chat");

socket.on("connect", function() {
	console.log("Connected to Socket.io server!");
});

socket.on("message", function (data){
	var message = data.text;
	var time = moment.utc(data.timestamp).local().format("hh:mm a");
	$chat.append("<strong>"+ time + " -</strong> " +
				 message + "<br>");
});

// Handles submitting of new message
$form.on("submit", function (event){
	event.preventDefault();

	socket.emit("message", {
		text: $messageInput.val()
	});

	$messageInput.val("");
});