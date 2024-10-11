const express = require("express");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
require("../config");

const router = express.Router();

const userController = require("../controllers/userController");

// Get
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		res.send("hello");
	}),
);

// Create User POST
router.post("/", userController.user_create);

// Log In User POST
router.post("/login", userController.user_login);

router.post(
	"/:userid",
	passport.authenticate("jwt", { session: false }),
	userController.add_friend,
);

module.exports = router;
