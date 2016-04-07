var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();

var moment = require("moment");

var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

var clientInfo = {};

io.on("connection", function (socket){
	console.log("User connected via socket.io!");

	socket.on("joinRoom", function (req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit("message", {
			name: "System",
			text: req.name + " has joined the room!",
			timestamp: +moment()
		})
	});

	socket.on("message", function (message){
		console.log("New message received: " + message.text);

		io.to(clientInfo[socket.id].room).emit("message", {
			text: message.text,
			name: message.name,
			timestamp: +moment()
		});
	});

	socket.emit("message", {
		text: "Welcome to the chat application!",
		name: "System",
		timestamp: +moment()
	});
});


http.listen(PORT, function (){
	console.log("Server started!");
});