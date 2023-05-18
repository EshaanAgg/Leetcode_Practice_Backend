const mongoose = require("mongoose");

const schema = mongoose.Schema({
	leetcode_id: String,
	title: String,
	acceptance: Number,
	difficulty: String,
	frequency: Number,
	link: String,
});

module.exports = mongoose.model("question", schema);
