require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("./models/user");

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
	new LocalStrategy(
		asyncHandler(async (username, password, done) => {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: "Incorrect username" });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				// passwords do not match!
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		}),
	),
);

passport.use(
	"jwt",
	new JWTStrategy(
		opts,
		asyncHandler(async (jwt_payload, done) => {
			const user = await User.findById(jwt_payload._id)
				.select(["-password"])
				.populate("friends", "display_name");
			if (Date.now() >= jwt_payload.expiresIn * 1000) {
				return done(null, false, {
					message: "JWT Token has expired, please log in again",
				});
			}
			if (!user) {
				return done(null, false, { message: "JWT Token is invalid" });
			}
			return done(null, user);
		}),
	),
);
