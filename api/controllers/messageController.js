const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const moment = require("moment");

const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

// Get Inbox GET x
exports.get_inbox = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.user.id);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const chats = await Chat.find({ chat_members: req.user.id });

	const { user } = req;

	return res.status(200).json({ chats, user });
});

// Get Chat Messages GET x
exports.get_chat = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.params.chatid);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const chat = await Chat.findById(req.params.chatid).populate(
		"chat_members",
		"display_name",
	);
	const user = await User.findById(req.user.id, "_id");

	if (!chat) {
		return res.status(400).json({ errors: "Chat not found" });
	}

	if (!chat.chat_members.find((e) => e._id.toString() === req.user.id)) {
		return res
			.status(401)
			.json({ errors: "You are not authorised to view this chat" });
	}

	const messages = await Message.find(
		{ to: req.params.chatid },
		"message from createdAt",
	)
		.populate("from", "display_name")
		.sort({
			createdAt: 1,
		});

	messages.forEach((item, index) => {
		const momentDate = moment(item.createdAt);
		const formattedDate = momentDate.format("lll");
		messages[index] = { ...item.toObject(), createdAt: formattedDate };
	});

	return res.status(200).json({ messages, user, chat });
});

// Start Chat POST x
exports.start_chat = [
	body("users")
		.isArray({ min: 1, max: 258 })
		.withMessage("You must select at least one friend to chat with")
		.escape(),
	body("chatName")
		.trim()
		.notEmpty()
		.withMessage("Chat name must not be empty")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		const { users } = req.body;

		let { chatName } = req.body;

		// Add requesting user to chat
		users.push(req.user.id);

		// Handle if there is only one user selected
		if (users.length === 2) {
			const chatExists = await Chat.findOne({ chat_members: users });

			if (chatExists) {
				return res.status(400).json({
					errors: [
						{
							msg: "Chat with this user already exists.",
							path: "chatExists",
						},
					],
				});
			}

			const displayName = await User.findById(users[0]).select(
				"display_name -_id",
			);
			chatName = displayName.display_name;
		}

		const validIds = await Promise.all(
			users.map(async (item) => {
				const isExistingUser = await User.findById(item);
				if (isExistingUser) {
					return item;
				}
			}),
		);

		if (validIds.length <= 1) {
			res.status(400).json({
				errors: [
					{
						msg: "Not enough valid users have been selected",
						path: "validUsers",
					},
				],
			});
		} else {
			const chat = new Chat({
				chat_name: chatName,
				chat_members: validIds,
			});
			await chat.save();
			res.status(200).json(chat);
		}
	}),
];

// Send Message POST x
exports.send_message = [
	body("message").trim().notEmpty(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const isValidId = mongoose.Types.ObjectId.isValid(req.params.chatid);

		if (!isValidId) {
			return res.status(400).json({
				errors: [
					{
						msg: "Chat ID is invalid",
						path: "chatid",
					},
				],
			});
		}
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		const chat = await Chat.findById(req.params.chatid);

		if (!chat) {
			res.status(400).json({
				errors: [
					{
						msg: "Chat cannot be found",
						path: "chat",
					},
				],
			});
		} else if (!chat.chat_members.includes(req.user.id)) {
			res.status(401).json({
				errors: [
					{
						msg: "You are not part of this chat",
						path: "notinchat",
					},
				],
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
