const express = require("express");
const cors = require("cors");
const { EventEmitter } = require("events");

const app = express();
const emitter = new EventEmitter();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/get-messages", (req, res) => {
	emitter.once("newMessage", (message) => {
		res.json(message);
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
