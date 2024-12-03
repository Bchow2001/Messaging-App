import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

function FriendsItem({ friend, handleCheck }) {
	return (
		<div className="friend-form-group">
			<input
				type="checkbox"
				name={friend._id}
				id={friend._id}
				onChange={handleCheck}
			/>
			<label htmlFor={friend._id}>{friend.display_name}</label>
		</div>
	);
}

function FriendsList({ friends, handleCheck }) {
	if (friends.length !== 0) {
		return (
			<fieldset>
				<legend>New Chat to:</legend>
				{friends.map((friend) => {
					return (
						<FriendsItem
							key={friend._id}
							friend={friend}
							handleCheck={handleCheck}
						/>
					);
				})}
			</fieldset>
		);
	} else {
		return <h2>Add friends to start a chat!</h2>;
	}
}

function StartChat({ user }) {
	const [chatUserIds, setChatUserIds] = useState([]);
	const [chatName, setChatName] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const name = chatUserIds.length > 1 ? chatName : chatUserIds[0];
		const requestOptions = {
			method: "POST",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				users: chatUserIds,
				chatName: name,
			}),
		};
		console.log(requestOptions);
		try {
			let response = await fetch(
				"http://localhost:3000/messages",
				requestOptions,
			);
			if (response.status === 200) {
				response = await response.json();
			} else {
				console.log("no");
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleCheck = (e) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setChatUserIds([...chatUserIds, e.target.id]);
		} else {
			const arr = [...chatUserIds];
			const index = arr.indexOf(e.target.id);
			if (index !== -1) {
				arr.splice(index, 1);
				setChatUserIds(arr);
			}
		}
	};

	if (user) {
		return (
			<>
				<h1>Start Chat!</h1>
				<form onSubmit={handleSubmit}>
					<FriendsList
						friends={user.friends}
						handleCheck={handleCheck}
					/>
					{chatUserIds.length > 1 && (
						<div className="form-group">
							<label htmlFor="chatName">Chat Name:</label>
							<input
								type="text"
								name="chatName"
								id="chatName"
								value={chatName}
								onChange={(e) => setChatName(e.target.value)}
							/>
						</div>
					)}
					{chatUserIds.length > 0 && (
						<button type="submit">Submit</button>
					)}
				</form>
			</>
		);
	} else {
		<Navigate to="/login" />;
	}
	console.log(user);
}

export default StartChat;
