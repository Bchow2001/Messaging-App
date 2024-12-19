import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import StartChat from "./StartChat";

function ChatItem({ chat }) {
	return (
		<li>
			<Link to={`${chat._id}`}>
				<h2>{chat.chat_name}</h2>
			</Link>
		</li>
	);
}

function ChatsList({ chats }) {
	if (chats.length !== 0) {
		return (
			<ul>
				{chats.map((chat) => {
					return <ChatItem key={chat._id} chat={chat} />;
				})}
			</ul>
		);
	} else {
		return <h2>No Chats Found!</h2>;
	}
}

function Inbox() {
	const [chats, setChats] = useState(null);
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchChats() {
			try {
				let response = await fetch("http://localhost:3000/messages", {
					method: "Get",
					headers: new Headers({
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					}),
					mode: "cors",
				});
				if (response.status === 200) {
					response = await response.json();
					setChats(response.chats);
					setUser(response.user);
				} else {
					navigate("/login");
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchChats();
	}, [navigate]);

	if (user) {
		return (
			<>
				<h1>Inbox</h1>
				<Link to={`/profile/${user._id}`}>{user.display_name}</Link>
				<br />
				<Link to={`/addfriend`}>Add Friends!</Link>
				{chats != null && <ChatsList chats={chats} />}
				<StartChat user={user} />
			</>
		);
	}
}

export default Inbox;
