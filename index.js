const express = require("express");
const mongoose = require("mongoose");
const Company = require("./models/company");
const morgan = require("morgan");
require("dotenv").config();

mongoose
	.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, dbName: "leetcode" })
	.then(() => {
		const app = express();

		app.use(express.json());
		app.use(
			express.urlencoded({
				extended: true,
			})
		);
		app.use(morgan());

		app.listen(5001, () => {
			console.log("Server has started!");
		});

		app.get("/company", async (req, res) => {
			const comapnies = await Company.find().select(["name"]).distinct("name").lean();
			res.json(comapnies);
		});

		app.post("/time", async (req, res) => {
			const { company } = req.body;
			console.log(company);
			if (!company) res.json([]);
			else {
				const timeline = await Company.find({
					name: company,
				})
					.select("timeline")
					.lean();

				console.log(timeline);
				res.json(timeline.map((obj) => obj.timeline));
			}
		});

		app.post("/questions", async (req, res) => {
			const { company, timeline } = req.body;
			console.log(company, timeline);
			if (!company || !timeline) res.json([]);
			else {
				const questions = await Company.find({
					name: company,
					timeline,
				})
					.select("questions")
					.populate("questions")
					.lean();
				console.log(questions);
				res.json(questions.map((obj) => obj.questions));
			}
		});
	});
