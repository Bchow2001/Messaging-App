import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

function FriendsItem({ friend }) {
	return (
		<div className="friend-form-group">
			<input type="checkbox" name={friend._id} id={friend._id} />
			<label htmlFor={friend._id}>{friend.display_name}</label>
		</div>
	);
}

function FriendsList({ friends }) {
	if (friends.length !== 0) {
		return (
			<fieldset>
				<legend>New Chat to:</legend>
				{friends.map((friend) => {
					return <FriendsItem key={friend._id} friend={friend} />;
				})}
			</fieldset>
		);
	} else {
		return <h2>Add friends to start a chat!</h2>;
	}
}

function StartChat({ user }) {
	if (user) {
		return (
			<>
				<h1>Start Chat!</h1>
				<FriendsList friends={user.friends} />
			</>
		);
	} else {
		<Navigate to="/login" />;
	}
	console.log(user);
}

export default StartChat;
