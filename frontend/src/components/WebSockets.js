import React, { useRef, useState } from "react";

const PORT = process.env.PORT || 8000;

const WebSockets = () => {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [connected, setConnected] = useState(false);
	const [username, setUsername] = useState("");
	const socket = useRef();

	function connect() {
		socket.current = new WebSocket(`ws://localhost:${PORT}`);

		socket.current.onopen = () => {
			setConnected(true);

			const message = {
				event: "connection",
				username,
				id: Date.now(),
			};
			socket.current.send(JSON.stringify(message));
		};

		socket.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setMessages((prev) => [message, ...prev]);
		};

		socket.current.onclose = () => {
			console.log("Socket closed");
		};

		socket.current.onerror = () => {
			console.log("Socket error occurred");
		};
	}

	const sendMessage = async () => {
		const message = {
			event: "message",
			id: Date.now(),
			username,
			message: inputValue,
		};
		socket.current.send(JSON.stringify(message));
		setInputValue("");
	};

	if (!connected) {
		return (
			<div className="form">
				<input
					type="text"
					placeholder="Enter your name"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
				<button onClick={connect}>Enter</button>
			</div>
		);
	}
	return (
		<>
			<div className="form">
				<input
					type="text"
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<button onClick={sendMessage}>Send message</button>
			</div>
			{messages.map((message) => (
				<div key={message.id}>
					{message.event === "connection" && (
						<div className="connection">{message.username} connected</div>
					)}
					{message.event === "message" && (
						<div className="message">
							<h3>{message.username}</h3>
							<span>{message.message}</span>
						</div>
					)}
				</div>
			))}
		</>
	);
};

export default WebSockets;
