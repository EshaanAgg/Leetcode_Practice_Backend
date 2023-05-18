const mongoose = require("mongoose");

const schema = mongoose.Schema({
	name: String,
	timeline: String,
	questions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
		},
	],
});

module.exports = mongoose.model("Company", schema);
