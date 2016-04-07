var name = getQueryVariable("name") || "Anonymous";
var room = getQueryVariable("room") || "Lobby";
console.log(name + " wants to join " + room);

var socket = io();

var $form = $("#message-form");
var $messageInput = $("input[name=message]");
var $chat = $("#chat");

$("#room-title").text(room);

//On received connection from the server
socket.on("connect", function() {
	console.log("Connected to Socket.io server!");

	socket.emit("joinRoom", {
		name: name,
		room: room
	});
});

//On received 'message' from the server
socket.on("message", function (data){
	var time = moment.utc(data.timestamp).local().format("HH:mm");

	$chat.append("<strong>["+ data.name +
				 "] " + time + " -</strong> " +
				 data.text + "<br>");
});

//On 'submit' of form, send data to the server
$form.on("submit", function (event){
	event.preventDefault();

	socket.emit("message", {
		text: $messageInput.val(),
		name: name
	});

	$messageInput.val("");
});