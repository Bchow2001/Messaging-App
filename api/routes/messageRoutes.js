const express = require("express");
const passport = require("passport");
require("../config");

const router = express.Router();

const messageController = require("../controllers/messageController");

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	messageController.inbox,
);

router.post(
	"/user/:userid",
	passport.authenticate("jwt", { session: false }),
	messageController.send_message_user,
);

module.exports = router;
