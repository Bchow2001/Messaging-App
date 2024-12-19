import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AddFriends() {
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [reqUser, setReqUser] = useState(null);
	const [added, setAdded] = useState(false);
	const [errors, setErrors] = useState([]);

	const navigate = useNavigate();

	const handleSearch = async (e) => {
		e.preventDefault();
		setErrors([]);
		const requestOptions = {
			method: "POST",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				username: username,
			}),
		};
		try {
			let response = await fetch(
				"http://localhost:3000/user/friends",
				requestOptions,
			);
			if (response.status === 200) {
				response = await response.json();
				console.log(response);
				setUser(response.user);
				setReqUser(response.reqUser);
				setUsername("");
			} else if (response.status === 403) {
				response = await response.json();
				setErrors(response.errors);
			} else {
				navigate("/login");
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleAddFriend = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				userId: user._id,
			}),
		};
		try {
			let response = await fetch(
				"http://localhost:3000/user/friends/add",
				requestOptions,
			);
			if (response.status === 200) {
				setAdded(true);
			} else if (response.status === 403) {
				response = await response.json();
				setErrors(response.errors);
			} else {
				navigate("/login");
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<Link to="/inbox">Inbox</Link>
			<form onSubmit={handleSearch}>
				<div className="form-group">
					<label htmlFor="username">Search for a username</label>
					<input
						type="text"
						name="username"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<button>Submit</button>
				<div>Please use exact case for username</div>
			</form>
			{user && (
				<>
					<form onSubmit={handleAddFriend}>
						<div className="form-group">
							<label htmlFor="username">{user.username}</label>
							{user._id !== reqUser._id ? (
								<button id={user._id}>Add Friend</button>
							) : (
								<span> Cannot add yourself as user</span>
							)}
						</div>
					</form>
				</>
			)}
			<div>
				{errors.length !== 0 &&
					errors.map((error) => {
						return <p key={error.path}>{error.msg}</p>;
					})}
			</div>
			{added && <div>Friend successfully added</div>}
		</>
	);
}

export default AddFriends;
