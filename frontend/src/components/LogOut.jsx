import { useNavigate } from "react-router-dom";

function LogOut() {
	const navigate = useNavigate();

	const handleLogOut = () => {
		localStorage.removeItem("accessToken");
		navigate("/login");
	};

	return <button onClick={handleLogOut}>Log out</button>;
}

export default LogOut;
