const WebSockets = require("ws");

const PORT = process.env.PORT || 8000;

const Server = new WebSockets.Server({ port: PORT }, () => {
	console.log(`Server started on port ${PORT}`);
});

Server.on("connection", function (WebSocket) {
	WebSocket.on("message", function (message) {
		message = JSON.parse(message);
		switch (message.event) {
			case "message":
				return broadcastMessage(message);
			case "connection":
				return broadcastMessage(message);
		}
	});
});

function broadcastMessage(message) {
	Server.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
