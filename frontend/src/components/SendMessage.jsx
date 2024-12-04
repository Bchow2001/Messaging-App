import { useState } from "react";
import { useParams } from "react-router-dom";

function SendMessage() {
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState([]);
	const { chatid } = useParams();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				message: message,
			}),
		};
		try {
			let response = await fetch(
				`http://localhost:3000/messages/${chatid}`,
				requestOptions,
			);
			if (response.status === 200) {
				response = await response.json();
				window.location.reload();
			} else {
				response = await response.json();
				setErrors(response.errors);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="message">Send a message:</label>
					<input
						type="text"
						name="message"
						id="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Write your message here"
					/>
				</div>
				<div>{message && <button type="submit"> Submit</button>}</div>
			</form>
			<div>
				{errors.length !== 0 &&
					errors.map((error) => {
						return <p key={error.path}>{error.msg}</p>;
					})}
			</div>
		</>
	);
}

export default SendMessage;
