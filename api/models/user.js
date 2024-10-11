const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		username: { type: String, required: true, maxLength: 50 },
		password: { type: String, required: true },
		first_name: { type: String, required: true, maxLength: 100 },
		last_name: { type: String, required: true, maxLength: 100 },
		display_name: { type: String, required: true, maxLength: 35 },
		profile_pic: { type: String },
		profile_bio: { type: String, maxLength: 500 },
		friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
		last_activity: { type: Date },
	},
	{ timestamps: true },
);

UserSchema.virtual("fullName").get(function () {
	let fullName = "";
	if (this.first_name && this.last_name) {
		fullName = `${this.first_name} ${this.last_name}`;
	}
	return fullName;
});

UserSchema.virtual("url").get(function () {
	return `/api/users/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
