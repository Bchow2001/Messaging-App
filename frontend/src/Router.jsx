import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import Inbox from "./components/Inbox";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import "./index.css";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Navigate to="/inbox" />,
			// errorElement: <ErrorPage />,
		},

		{ path: "/register", element: <Register /> },
		{ path: "/login", element: <LogIn /> },
		{ path: "/inbox", element: <Inbox /> },
		{ path: "/inbox/:chatid", element: <Chat /> },
		{ path: "/profile/:userid", element: <Profile /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
