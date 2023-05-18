const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");

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
	else if ((time = "2year")) time = "2 Years";
	else if ((time = "6months")) time = "6 Months";
	else time = "All Time";

	console.log(name, time);
	return [name, time];
};

files.forEach(async (company) => {
	const [companyName, companyTime] = getCompanyData(company);
	if (companyName == "Uber") {
		const filePath = path.join(fullPath, company);
		const data = [];
		fs.createReadStream(filePath)
			.pipe(parse({ delimiter: "," }))
			.on("data", (r) => {
				console.log(r);
				// data.push(r);
			})
			.on("end", () => {
				// console.log(data);
			});
	}
});
