const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatSchema = new Schema(
	{
		chat_name: { type: String, required: true, maxLength: 128 },
		chat_members: [
			{ type: Schema.Types.ObjectId, required: true, ref: "User" },
		],
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Chat", ChatSchema);
