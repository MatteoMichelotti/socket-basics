var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();

var moment = require("moment");

var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

io.on("connection", function (socket){
	console.log("User connected via socket.io!");

	socket.on("message", function (message){
		console.log("New message received: " + message.text);

		io.emit("message", {
			text: message.text,
			timestamp: +moment()
		});
	});

	socket.emit("message", {
		text: "Welcome to the chat application!",
		timestamp: +moment()
	});
});


http.listen(PORT, function (){
	console.log("Server started!");
});