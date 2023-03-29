import express from "express";
import fs from "fs";
import {
	index_template,
	lesson_answer_template,
	lesson_template,
	list_template,
} from "./templates.js";
import { getRandomInt } from "./utils.js";

const languaje_file = "./words.json";
const parsedJson = JSON.parse(fs.readFileSync(languaje_file));
const words_per_lesson = 5;
const app = express();
app.use(express.urlencoded({ extended: true }));

function getGroups() {
	return Object.keys(parsedJson);
}

function selectWords(words) {
	let ogWords = Object.keys(words);
	let counter = 0;
	let wordsSelected = [];
	let ret = [];

	while (counter < words_per_lesson) {
		let aux = getRandomInt(ogWords.length);
		if (!wordsSelected.includes(aux)) {
			wordsSelected.push(aux);
			counter++;
		}
	}

	for (let index of wordsSelected) {
		let aux = [
			Object.keys(words)[index],
			words[Object.keys(words)[index]].translation,
		];
		ret.push(aux);
	}

	return ret;
}

function establishGroupsEndPoints() {
	for (let group of getGroups()) {
		let wordsForLesson;
		let currentWord;
		let wordsToAsk = [];

		app.get(`/${group}/list`, (req, res) => {
			wordsForLesson = selectWords(parsedJson[group]);
			for (let word of wordsForLesson) {
				wordsToAsk.push(word, [word[1], word[0]]);
			}
			res.send(list_template(wordsForLesson, group));
		});

		app.get(`/${group}/lesson`, (req, res) => {
			if (wordsToAsk.length == 0) {
				res.redirect("/");
				return;
			}
			let index = getRandomInt(wordsToAsk.length);
			currentWord = wordsToAsk[index];
			res.send(lesson_template(currentWord[0], group));
			wordsToAsk.splice(index, 1);
		});

		app.post(`/${group}/lesson`, (req, res) => {
			if (req.body.answer.toUpperCase() == currentWord[1].toUpperCase()) {
				res.redirect(`/${group}/lesson`);
				return;
			}
			res.send(
				lesson_answer_template(currentWord, group, req.body.answer)
			);
		});
	}
}

app.get("/", (req, res) => {
	res.send(index_template(getGroups()));
});

//use process.cwd() seems odd and maybe vulnerable somehow, try to fix later
app.get("/russian_keyboard", (req, res) => {
	res.sendFile(process.cwd() + "/russian_keyboard.jpg");
});

establishGroupsEndPoints();
app.listen(8080, () => console.log("Listening in 8080"));
