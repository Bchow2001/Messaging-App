import { useState } from "react";
import { Navigate } from "react-router-dom";

function LogIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			mode: "cors",
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		};
		try {
			let response = await fetch(
				"http://localhost:3000/user/login",
				requestOptions,
			);
			response = await response.json();
			if (response.accessToken) {
				const access = response.accessToken;
				localStorage.setItem("accessToken", access);
				setUsername("");
				setPassword("");
				setError("");
				setUser(true);
				console.log(access);
			} else {
				setPassword("");
				setError(response.message);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username: </label>
					<input
						type="input"
						name="username"
						id="username"
						autoComplete="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password: </label>
					<input
						type="password"
						name="password"
						id="password"
						autoComplete="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			<div>{error !== "" && <p>{error}</p>}</div>
			{user && console.log(user)}
		</>
	);
}

export default LogIn;
