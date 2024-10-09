const express = require("express");
const passport = require("passport");
require("../config");

const router = express.Router();

// Create User POST
router.post("/", userController.userController.user_create);
