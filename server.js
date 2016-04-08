var PORT = process.env.PORT || 3000;
var COMMANDS = ["@currentUsers"];

var express = require("express");
var app = express();

var moment = require("moment");

var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

var clientInfo = {};

function getCurrentUsers (socket) {
	var users = [];
	var info = clientInfo[socket.id];

	if (info) {
		Object.keys(clientInfo).forEach(function (userID) {
			if (clientInfo[userID].room === info.room) {
				users.push(clientInfo[userID].name);
			}
		});
		return users.join(", ");
	}
}

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

		var info = clientInfo[socket.id];

		switch (COMMANDS.indexOf(message.text)){
			case 0:
				//@currentUsers
				socket.emit("message", {
					text: "Current users: " + getCurrentUsers(socket),
					name: "System",
					timestamp: +moment()
				});
				break;
			case -1: 
				//Normal message
				io.to(info.room).emit("message", {
					text: message.text,
					name: message.name,
					timestamp: +moment()
				});
		}				
	});

	socket.on("disconnect", function (){
		var info = clientInfo[socket.id];

		if (info){
			socket.leave(info.room);
			io.to(info.room).emit("message", {
				text: info.name + " disconnected!",
				name: "System",
				timestamp: +moment()
			});
			delete clientInfo[socket.id];
		}			
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