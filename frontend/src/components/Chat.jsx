import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

function MessageItem({ message, userId }) {
	if (message._id === userId) {
		return (
			<div className="from">
				<h3 className="message">{message.messsage}</h3>
			</div>
		);
	} else {
		return (
			<div className="to">
				<h4 className="sender">{message.from.display_name}</h4>
				<h3 className="message">{message.message}</h3>
				<h5 className="time">{message.createdAt}</h5>
			</div>
		);
	}
}

function MessageList({ messages, userId }) {
	if (messages.length !== 0) {
		return (
			<ul>
				{messages.map((message) => {
					return (
						<MessageItem
							key={message._id}
							message={message}
							userId={userId}
						/>
					);
				})}
			</ul>
		);
	} else {
		return <h2>No Messages Yet!</h2>;
	}
}

function Messages() {
	const [messages, setMessages] = useState(null);
	const [userId, setUserId] = useState(null);
	const [chat, setChat] = useState(null);
	const { chatid } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchMessage() {
			try {
				let response = await fetch(
					`http://localhost:3000/messages/${chatid}`,
					{
						method: "Get",
						headers: new Headers({
							Authorization: `Bearer ${localStorage.getItem(
								"accessToken",
							)}`,
						}),
						mode: "cors",
					},
				);
				if (response.status === 200) {
					response = await response.json();
					setMessages(response.messages);
					setUserId(response.user._id);
					setChat(response.chat);
				} else {
					navigate("/login");
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchMessage();
	}, [navigate]);

	if (userId) {
		return (
			<>
				<h1>{chat != null && chat.chat_name}</h1>
				{messages != null && (
					<MessageList messages={messages} userId={userId} />
				)}
			</>
		);
	} else {
		<Navigate to="/login" />;
	}
}

export default Messages;
