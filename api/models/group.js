const mongoose = require("mongoose");

const { Schema } = mongoose;

const GroupSchema = new Schema(
	{
		group_name: { Type: String, required: true, maxLength: 128 },
		group_members: [
			{ Type: Schema.Types.ObjectId, required: true, ref: "User" },
		],
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Group", GroupSchema);
