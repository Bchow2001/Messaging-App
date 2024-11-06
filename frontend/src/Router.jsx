import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import Inbox from "./components/Inbox";
import "./index.css";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Navigate to="/messages" />,
			// errorElement: <ErrorPage />,
		},

		{ path: "/register", element: <Register /> },
		{ path: "/login", element: <LogIn /> },
		{ path: "/inbox", element: <Inbox /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
