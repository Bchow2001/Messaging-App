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

module.exports = router;
