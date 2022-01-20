const express = require("express");
const cors = require("cors");
const { EventEmitter } = require("events");

const app = express();
const emitter = new EventEmitter();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/connect", (req, res) => {
	res.writeHead(200, {
		Connection: "keep-alive",
		"Content-type": "text/event-stream",
		"Cache-control": "no-cache",
	});
	emitter.on("newMessage", (message) => {
		res.write(`data: ${JSON.stringify(message)} \n\n`);
	});
});

app.post("/new-message", (req, res) => {
	const message = req.body;
	emitter.emit("newMessage", message);
	res.status(200).json();
});

try {
	app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
} catch (error) {
	console.log(error);
}
