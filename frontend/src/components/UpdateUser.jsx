import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
function UpdateUser({ initialUser, setEditing }) {
	const [first, setFirst] = useState(initialUser.first_name);
	const [last, setLast] = useState(initialUser.last_name);
	const [display, setDisplay] = useState(initialUser.display_name);
	const [profile, setProfile] = useState(initialUser.profile_bio);
	const [errors, setErrors] = useState([]);
	const navigate = useNavigate();

	const handleUpdate = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "PUT",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				first_name: first,
				last_name: last,
				display_name: display,
				profile_bio: profile,
			}),
		};
		try {
			let response = await fetch(
				`http://localhost:3000/user/${initialUser._id}`,
				requestOptions,
			);
			if (response.status === 400) {
				response = await response.json();
				setErrors(response.errors);
			} else if (response.status === 200) {
				setEditing(false);
				navigate(`/profile/${initialUser._id}`);
				console.log("Done!");
			}
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<>
			<form onSubmit={handleUpdate}>
				<h1>Username: {initialUser.username}</h1>
				<div className="form-group">
					<label htmlFor="display">Display Name:</label>
					<input
						type="input"
						name="display"
						id="display"
						value={display}
						onChange={(e) => setDisplay(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="profile">
						Tell us a little about yourself!:
					</label>
					<input
						type="text"
						name="profile"
						id="profile"
						value={profile}
						onChange={(e) => setProfile(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="first">First Name:</label>
					<input
						type="text"
						name="first"
						id="first"
						value={first}
						onChange={(e) => setFirst(e.target.value)}
					/>
					<label htmlFor="last">Last Name:</label>
					<input
						type="text"
						name="last"
						id="last"
						value={last}
						onChange={(e) => setLast(e.target.value)}
					/>
				</div>
				<button type="submit">Save Changes</button>
			</form>
			<button
				onClick={(e) => {
					setEditing(false);
				}}
			>
				Cancel
			</button>
			<div>
				{errors.length !== 0 &&
					errors.map((error) => {
						return <p key={error.path}>{error.msg}</p>;
					})}
			</div>
		</>
	);
}

export default UpdateUser;
