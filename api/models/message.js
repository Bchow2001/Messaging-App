const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema(
	{
		message: { type: String, required: true, maxLength: 128 },
		image: { type: String },
		from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		to: [
			{
				type: Schema.Types.ObjectId,
				required: true,
				refPath: "docModel",
			},
		],
		docModel: { type: String, required: true, enum: ["Group", "User"] },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Message", MessageSchema);
