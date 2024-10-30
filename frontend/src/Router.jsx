import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import App from "./App";
import LogIn from "./components/LogIn";
import Register from "./components/Register";
import ErrorPage from "./components/ErrorPage";
import "./index.css";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Navigate to="/messages" />,
			errorElement: <ErrorPage />,
		},
		{ path: "/messages", element: <App /> },
		{ path: "/users/logIn", element: <LogIn /> },
		{ path: "/users/register", element: <Register /> },
		{ path: "/error", element: <ErrorPage /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
