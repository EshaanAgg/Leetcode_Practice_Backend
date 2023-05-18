const mongoose = require("mongoose");

const schema = mongoose.Schema({
	name: String,
	timeline: String,
	questions: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "question",
	},
});

module.exports = mongoose.model("company", schema);
