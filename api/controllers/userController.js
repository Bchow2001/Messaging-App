require("dotenv").config;
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const moment = require("moment");

require("../config");

const User = require("../models/user");

// Create User POST x
exports.user_create = [
	body("username")
		.trim()
		.isLength(6)
		.withMessage("Username must be at least 6 characters")
		.isAlphanumeric()
		.custom(async (value) => {
			const userExists = await User.findOne({
				username: value,
			})
				.collation({ locale: "en", strength: 2 })
				.exec();
			if (userExists) {
				throw new Error("Username is already in use");
			}
		}),
	body("password")
		.trim()
		.isLength(8)
		.withMessage("Password must be at least 8 characters"),
	body("confirm_password")
		.trim()
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords must match"),
	body("first_name")
		.trim()
		.isLength(2)
		.withMessage("First name must be at least 2 characters")
		.isAlpha(),
	body("last_name")
		.trim()
		.isLength(2)
		.withMessage("Last name must be at least 2 characters")
		.isAlpha(),
	body("display_name")
		.trim()
		.isLength(2)
		.withMessage("Display name must be at least 2 characters")
		.isAlphanumeric(),
	body("profile_bio").trim(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const user = new User({
			username: req.body.username,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			display_name: req.body.display_name,
			profile_bio: req.body.profile_bio,
		});

		if (!errors.isEmpty()) {
			res.status(403).json(errors);
		} else {
			// Data from form is valid username not duplicate
			// Hash password
			bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
				if (err) {
					next(err);
				} else {
					user.password = hashedPassword;
					await user.save();
					res.status(200).json("User created");
				}
			});
		}
	}),
];

// Log in User POST x
exports.user_login = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Please enter a username")
		.escape(),
	body("password")
		.trim()
		.notEmpty()
		.withMessage("Please enter a password")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors
			res.json(errors);
		} else {
			passport.authenticate(
				"local",
				{ session: false },
				(err, user, message) => {
					if (err) {
						return res.json({ err });
					}
					if (!user) {
						return res.json({ message });
					}
					const { _id } = user;

					/** This is what ends up in our JWT */
					const payload = { _id };

					/** assigns payload to req.user */
					req.login(payload, { session: false }, (error) => {
						if (error) {
							return res.status(400).send({ error });
						}

						/** generate a signed json web token and return it in the response */
						const accessToken = jwt.sign(
							payload,
							process.env.JWT_SECRET,
							{ expiresIn: "30m" },
						);

						/** assign our jwt to the cookie */
						res.send({ accessToken });
					});
				},
			)(req, res, next);
		}
	}),
];

// Single User details GET x
exports.user_details = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.params.userid);

	if (!isValidId) {
		return res.status(400).json({
			errors: [{ msg: "User Id is invalid", path: "invalidid" }],
		});
	}

	let reqUser = await User.findById(req.params.userid).select(["-password"]);
	const { user } = req;

	const momentDate = moment(reqUser.createdAt);
	const formattedDate = momentDate.format("lll");
	reqUser = { ...reqUser.toObject(), createdAt: formattedDate };

	if (!reqUser) {
		res.status(400).json({
			errors: [{ msg: "User cannot be found", path: "noUser" }],
		});
	} else {
		return res.status(200).json({ reqUser, user });
	}
});

// Update User PUT
exports.user_update = [
	body("password")
		.trim()
		.isLength(8)
		.withMessage("Password must be at least 8 characters")
		.escape(),
	body("confirm_password")
		.trim()
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords must match")
		.escape(),
	body("first_name")
		.trim()
		.isLength(2)
		.withMessage("First name must be at least 2 characters")
		.escape(),
	body("last_name")
		.trim()
		.isLength(2)
		.withMessage("Last name must be at least 2 characters")
		.escape(),
	body("display_name")
		.trim()
		.isLength(2)
		.withMessage("Display name must be at least 2 characters")
		.escape(),
	body("profile_bio").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const isValidId = mongoose.Types.ObjectId.isValid(req.params.userid);

		if (!isValidId) {
			return res.status(400).json({ errors: "id is not valid" });
		}

		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			display_name: req.body.display_name,
			profile_bio: req.body.profile_bio,
			_id: req.params.userid,
		});

		if (req.params.userid !== req.user.id) {
			res.json({ errors: "You cannot update another user" });
		} else if (!errors.isEmpty()) {
			res.json(errors);
		} else {
			bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
				if (err) {
					next(err);
				} else {
					user.password = hashedPassword;
					await User.findByIdAndUpdate(req.params.userid, user, {});
					res.status(200).json({ message: "User updated" });
				}
			});
		}
	}),
];

// Delete User DELETE
exports.user_delete = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.params.userid);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const user = await User.findById(req.params.userid);

	if (!user) {
		res.json({ errors: "User cannot be found" });
	} else if (req.params.userid !== req.user.id) {
		res.json({ errors: "You cannot delete another user" });
	} else {
		await User.findByIdAndDelete(req.user.id);

		return res.status(200).json({ message: "User has been deleted" });
	}
});

// Find Friend POST x
exports.find_friend = [
	body("username")
		.trim()
		.isLength(6)
		.withMessage("Username must be at least 6 characters")
		.isAlphanumeric(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(403).json(errors);
		}

		const user = await User.findOne({ username: req.body.username }).select(
			"-password",
		);

		if (!user) {
			return res.status(403).json({
				errors: [{ msg: "User cannot be found", path: "noUser" }],
			});
		}

		const reqUser = req.user;

		return res.status(200).json({ user, reqUser });
	}),
];

// Add user as friend POST
exports.add_friend = asyncHandler(async (req, res, next) => {
	console.log(req.body.userId);
	const isValidId = mongoose.Types.ObjectId.isValid(req.body.userId);

	if (!isValidId) {
		return res
			.status(403)
			.json({ errors: [{ msg: "Invalid ID", path: "invalidId" }] });
	}

	const friend = await User.findById(req.body.userId);
	const user = await User.findById(req.user.id);

	if (!friend) {
		res.status(403).json({
			errors: [{ msg: "User cannot be found", path: "noUser" }],
		});
	} else if (!user) {
		res.status(400).json({
			errors: [{ msg: "User cannot be found", path: "noUser" }],
		});
	} else if (req.body.userId === req.user.id) {
		res.status(403).json({
			errors: [
				{
					msg: "You cannot add yourself as a friend, you sly dog",
					path: "duplicateUser",
				},
			],
		});
	} else if (user.friends.includes(req.body.userId)) {
		res.status(403).json({
			errors: [
				{ msg: "User is already a friend", path: "duplicateFriend" },
			],
		});
	} else {
		await User.findByIdAndUpdate(
			req.user.id,
			{
				$push: { friends: req.body.userId },
			},
			{},
		);

		return res.status(200).json({ user });
	}
});

// Remove user as friend
exports.remove_friend = asyncHandler(async (req, res, next) => {
	const isValidId = mongoose.Types.ObjectId.isValid(req.params.userid);

	if (!isValidId) {
		return res.status(400).json({ errors: "id is not valid" });
	}

	const friend = await User.findById(req.params.userid);
	const user = await User.findById(req.user.id);

	if (!friend) {
		res.json({ errors: "User cannot be found" });
	} else if (req.params.userid === req.user.id) {
		res.json({
			errors: "You cannot remove yourself as a friend you sly dog",
		});
	} else if (!user.friends.includes(req.params.userid)) {
		res.json({ errors: "User is not a friend" });
	} else {
		await User.findByIdAndUpdate(
			req.user.id,
			{
				$pull: { friends: req.params.userid },
			},
			{},
		);

		return res.status(200).json({ user });
	}
});
