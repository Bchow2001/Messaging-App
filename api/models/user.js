const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		username: { type: String, required: true, maxLength: 50 },
		password: { type: String, required: true },
		first_name: { type: String, required: true, maxLength: 100 },
		last_name: { type: String, required: true, maxLength: 100 },
		profile_pic: { type: String },
		profile_bio: { type: String, required: true, maxLength: 500 },
		friends: [{ Type: Schema.Types.ObjectId, ref: "User" }],
		online: { type: Boolean, required: true },
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
