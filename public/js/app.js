var socket = io();

socket.on("connect", function() {
	console.log("Connected to Socket.io server!");
});

socket.on("message", function (data){
	console.log("New message: " + data.text);
});