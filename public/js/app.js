var name = getQueryVariable("name") || "Anonymous";
var room = getQueryVariable("room");
console.log(name + " wants to join " + room);

var socket = io();

var $form = $("#message-form");
var $messageInput = $("input[name=message]");
var $chat = $("#chat");

//On received connection from the server
socket.on("connect", function() {
	console.log("Connected to Socket.io server!");
});

//On received 'message' from the server
socket.on("message", function (data){
	var time = moment.utc(data.timestamp).local().format("HH:mm");

	$chat.append("<strong>["+ data.author +
				 "] " +time + " -</strong> " +
				 data.text + "<br>");
});

//On 'submit' of form, send data to the server
$form.on("submit", function (event){
	event.preventDefault();

	socket.emit("message", {
		text: $messageInput.val(),
		author: name
	});

	$messageInput.val("");
});