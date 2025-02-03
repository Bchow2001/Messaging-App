import { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import UpdateUser from "./UpdateUser";

function Profile() {
	const [user, setUser] = useState(null);
	const [reqUser, setReqUser] = useState(null);
	const [errors, setErrors] = useState([]);
	const [editing, setEditing] = useState(false);
	const { userid } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchProfile() {
			const requestOptions = {
				method: "GET",
				headers: new Headers({
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken",
					)}`,
				}),
				mode: "cors",
			};
			try {
				let response = await fetch(
					`http://localhost:3000/user/${userid}`,
					requestOptions,
				);
				if (response.status === 200) {
					response = await response.json();
					setUser(response.user);
					setReqUser(response.reqUser);
				} else if (response.status === 400) {
					response = await response.json();
					setErrors(response.errors);
				} else {
					navigate("/login");
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchProfile();
	}, [navigate, userid, editing]);

	return (
		<>
			<h1>Profile</h1>
			{reqUser && (
				<>
					{!editing ? (
						<>
							<h1>{reqUser.display_name}</h1>
							<h2>
								Name: {reqUser.first_name} {reqUser.last_name}
							</h2>
							<h3>Bio: {reqUser.profile_bio}</h3>
							<h4>Joined at: {reqUser.createdAt}</h4>
							<h4>User Name: {reqUser.username}</h4>
							{user._id === reqUser._id && (
								<button onClick={(e) => setEditing(true)}>
									Edit profile
								</button>
							)}
							<Link to="/inbox">Inbox</Link>
						</>
					) : (
						<UpdateUser
							initialUser={user}
							setEditing={setEditing}
						/>
					)}
				</>
			)}
			<div>
				{errors.length !== 0 &&
					errors.map((error) => {
						return <p key={error.path}>{error.msg}</p>;
					})}
			</div>
		</>
	);
}

export default Profile;
