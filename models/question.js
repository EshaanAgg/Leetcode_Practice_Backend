const mongoose = require("mongoose");

const schema = mongoose.Schema({
	leetcode_id: Number,
	title: String,
	acceptance: String,
	difficulty: String,
	frequency: Number,
	link: String,
});

module.exports = mongoose.model("Question", schema);
