const express = require("express");
const passport = require("passport");
require("../config");

const router = express.Router();

const messageController = require("../controllers/messageController");

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	messageController.get_inbox,
);

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	messageController.start_chat,
);

router.get(
	"/:chatid",
	passport.authenticate("jwt", { session: false }),
	messageController.get_chat,
);

router.post(
	"/:chatid",
	passport.authenticate("jwt", { session: false }),
	messageController.send_message,
);

module.exports = router;
