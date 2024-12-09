import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddFriends() {
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [errors, setErrors] = useState([]);

	const handleSearch = async (e) => {
		e.preventDefault();
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
				setUser(response.user);
				setUsername("");
			} else if (response.status === 403) {
				response = await response.json();
				setErrors(response.errors);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
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
				<button type="submit">Submit</button>
			</form>
			{console.log(user)}
			{console.log(errors)}
		</>
	);
}

export default AddFriends;
