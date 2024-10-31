import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
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
	]);
	return <RouterProvider router={router} />;
};

export default Router;
