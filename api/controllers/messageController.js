const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Message = require("../models/message");
const User = require("../models/user");

// Get Inbox GET
exports.inbox = asyncHandler(async (req, res, next) => {
	// const uniqueMessages = await Message.aggregate([
	// 	{ $match: { $or: [{ from: req.user.id }, { to: req.user.id }] } },
	// ]);
	// const uniqueMessages = await Message.aggregate([
	// 	{ $match: { from: new mongoose.Types.ObjectId(`${req.user.id}`) } },
	// ]);

	const uniqueUsers = await Message.aggregate([
		{
			$match: {
				$or: [
					{
						from: new mongoose.Types.ObjectId(`${req.user.id}`),
					},
					{
						$in: [
							new mongoose.Types.ObjectId(`${req.user.id}`),
							"$to",
						],
					},
				],
			},
		},
	]);
	console.log(uniqueUsers);
	res.json(uniqueUsers);
});

// Post Message
exports.send_message_user = [
	body("message").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const isValidId = mongoose.Types.ObjectId.isValid(req.params.userid);

		if (!isValidId) {
			return res.status(400).json({ errors: "id is not valid" });
		}

		const to = await User.findById(req.params.userid);

		if (!to) {
			res.json({ errors: "User cannot be found" });
		} else if (req.params.userid === req.user.id) {
			res.json({ errors: "You cannot send a message to yourself" });
		} else {
			const message = new Message({
				message: req.body.message,
				from: req.user.id,
				to: [req.params.userid],
				docModel: "User",
			});
			await message.save();
			res.status(200).json({ message });
		}
	}),
];
