const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { parse } = require("csv-parse/sync");
const Question = require("../models/question");
const Company = require("../models/company");

const fullPath = path.join(__dirname, "./../../LeetCode-Questions-CompanyWise");
const files = fs.readdirSync(fullPath);

function titleCase(str) {
	str = str.toLowerCase();
	str = str.split(" ");
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(" ");
}

const getCompanyData = (company) => {
	const parts = company.split("_");
	const name = titleCase(parts[0].replace("-", " "));

	let [time, _extension] = parts[1].split(".");
	if (time == "1year") time = "1 Year";
	else if (time == "2year") time = "2 Years";
	else if (time == "6months") time = "6 Months";
	else time = "All Time";

	return [name, time];
};

const getQuestionId = async (leetcode_id, title, acceptance, difficulty, frequency, link) => {
	const fetchedQuestion = await Question.findOne({
		leetcode_id,
	}).lean();

	if (!fetchedQuestion) {
		const newQuestion = await Question.create({
			leetcode_id,
			title,
			acceptance,
			difficulty,
			frequency,
			link,
		});
		return newQuestion._id.toString();
	}
	return fetchedQuestion._id.toString();
};

const addToDatabase = async (questionData, companyName, companyTime) => {
	const questionIds = [];

	for (let i = 0; i < questionData.length; i++) {
		const r = questionData[i];
		const questionId = await getQuestionId(
			parseInt(r["ID"]),
			r["Title"].trim(),
			r["Acceptance"].trim(),
			r["Difficulty"].trim(),
			parseFloat(r["Frequency"]),
			r["Leetcode Question Link"].trim()
		);
		questionIds.push(questionId);
	}

	await Company.create({
		name: companyName,
		timeline: companyTime,
		questions: questionIds,
	});
};

mongoose.connect("mongodb://localhost:27017/leetcode", { useNewUrlParser: true }).then(async () => {
	for (let i = 0; i < files.length; i++) {
		const company = files[i];
		const [companyName, companyTime] = getCompanyData(company);

		const filePath = path.join(fullPath, company);
		const fileData = fs.readFileSync(filePath);

		const questionData = parse(fileData, {
			columns: true,
			skip_empty_lines: true,
		});

		await addToDatabase(questionData, companyName, companyTime);
		console.log(`All questions added successfully for the ${companyName}-${companyTime}`);
	}
});
