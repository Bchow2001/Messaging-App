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

	const chat = await Chat.findById(req.params.chatid);

	if (!chat) {
		return res.status(400).json({ errors: "Chat not found" });
	}

	if (!chat.chat_members.includes(req.user.id)) {
		return res
			.status(401)
			.json({ errors: "You are not authorised to view this chat" });
	}

	const messages = await Message.find({ to: req.params.chatid }).sort({
		createdAt: -1,
	});

	return res.status(200).json(messages);
});

// Start Chat POST
exports.start_chat = [
	body("users").isArray({ min: 2, max: 258 }).escape(),
	body("name").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		const { users } = req.body;

		users.push(req.user.id);

		const validIds = await Promise.all(
			users.map(async (item) => {
				const isExistingUser = await User.findById(item);
				if (isExistingUser) {
					return item;
				}
			}),
		);

		if (validIds.length <= 1) {
			res.json({ errors: "Not enough valid users have been selected" });
		} else {
			const chat = new Chat({
				chat_name: req.body.name,
				chat_members: validIds,
			});
			await chat.save();
			res.status(200).json({ chat });
		}
	}),
];

// Send Message POST
exports.send_message = [
	body("message").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const isValidId = mongoose.Types.ObjectId.isValid(req.params.chatid);

		if (!isValidId) {
			return res.status(400).json({ errors: "id is not valid" });
		}
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		const chat = await Chat.findById(req.params.chatid);

		if (!chat) {
			res.json({ errors: "Chat cannot be found" });
		} else if (!chat.chat_members.includes(req.user.id)) {
			res.status(401).json({
				errors: "You are not authorised to send messages to this chat",
			});
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
