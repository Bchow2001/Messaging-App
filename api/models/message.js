const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema(
	{
		message: { type: String, required: true, maxLength: 128 },
		image: { type: String },
		from: { Type: Schema.Types.ObjectId, required: true, ref: "User" },
		to: [
			{
				Type: Schema.Types.ObjectId,
				required: true,
				refPath: "docModel",
			},
		],
		docModel: { Type: String, required: true, enum: ["Group", "User"] },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Message", MessageSchema);
