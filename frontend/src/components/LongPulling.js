import React, { useEffect, useState } from "react";
import axios from "axios";

const LongPulling = () => {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		subscribe();
	}, []);

	const subscribe = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:${process.env.PORT || 8000}/get-messages`
			);
			setMessages((prev) => [data, ...prev]);
			subscribe();
		} catch (error) {
			setTimeout(() => subscribe(), 500);
		}
	};

	const sendMessage = async () => {
		await axios.post(
			`http://localhost:${process.env.PORT || 8000}/new-message`,
			{
				message: inputValue,
				id: Date.now(),
			}
		);
	};

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
				<div className="message" key={message.id}>
					{message.message}
				</div>
			))}
		</>
	);
};

export default LongPulling;
