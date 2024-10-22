const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

// Get Inbox GET
exports.get_inbox = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.user.id);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const chats = await Chat.find({ chat_members: req.user.id });

	return res.status(200).json({ chats });
});

// Get Chat Messages GET
exports.get_chat = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.params.chatid);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const messages = await Message.find({ to: req.params.chatid }).sort({
		createdAt: -1,
	});

	return res.status(200).json(messages);
});

// Start Chat POST
exports.start_chat = [body("")];

// Send Message POST
exports.send_message = [
	body("message").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const isValidId = mongoose.Types.ObjectId.isValid(req.params.chatid);

		if (!isValidId) {
			return res.status(400).json({ errors: "id is not valid" });
		}
		if (errors) {
			return res.status(400).json(errors);
		}

		const chat = await Chat.findById(req.params.chatid);

		if (!chat) {
			res.json({ errors: "Chat cannot be found" });
		} else {
			const message = new Message({
				message: req.body.message,
				from: req.user.id,
				to: req.params.chatid,
			});
			await message.save();
			res.status(200).json({ message });
		}
	}),
];
