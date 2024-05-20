/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Groq from "groq-sdk";
import { ChatCompletion } from "groq-sdk/resources/chat/index.mjs";
import type * as Party from "partykit/server";

// import { natureWords } from "./nature";
import { rules } from "./rules";
import { famousMovies, musicWords, natureWords, randomObjects } from "./words";

const groq: Groq = new Groq({
	apiKey: "APIKEY",
});

export default class ExtremeWordsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	wordArray: string[] = [];

	// eslint-disable-next-line @typescript-eslint/require-await
	async onStart() {
		console.log("Partykit server starting up");
	}

	// This Method Creates or returns the room
	async onRequest(req: Party.Request) {
		console.log("Got to OnRequest...");
		// TODO create or return room
		if (req.method === "POST") {
			const message: string = await req.json();
			console.log("Got to OnRequest. Message: " + JSON.stringify(message));
			if (this.gameExists) {
				console.log("Game exists, returning game!");
			} else {
				this.gameExists = true;
				console.log("Game does not exist, creating game!");
			}
		}

		if (this.gameExists) {
			return new Response("You got the party kit server!", {
				status: 200,
			});
		}
		console.log("You did a POST and didn't make it. Failing");
		return new Response("Not found", { status: 404 });
	}

	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		if (message === "startGame") {
			const rule = rules[Math.floor(Math.random() * rules.length)];
			const data = { player: requestJson.player, rule: rule.rule };
			const response = { message: "startGame", data: data };
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "getWord") {
			console.log("Data: " + JSON.stringify(requestJson.data));
			const category = requestJson.data.category;
			let array = randomObjects;
			if (category == "Nature") {
				array = natureWords;
			} else if (category == "Music") {
				array = musicWords;
			} else if (category == "Movies") {
				array = famousMovies;
			}
			const idx = Math.floor(Math.random() * array.length);
			const word = array[idx];
			const response = { message: "getWord", data: word };
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "prevWords") {
			console.log("Previous words are: " + message.data);
			// const response = { message: "prevWords", data: message.data };
			this.room.broadcast(request);
		} else if (message === "generateWords") {
			const words = await this.generateWords("nature");
			const data = { words: words };
			const response = { message: "generateWords", data: data };
			console.log();
			// const response = { message: "prevWords", data: message.data };
			this.room.broadcast(JSON.stringify(response));
		} else {
			console.log("Message is not getWord");
		}
	}

	async generateWords(category: string) {
		let words: string[] = ["volcano"];
		console.log("Category: " + category);
		const chatCompletion: ChatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: "Generate a a list of 50 comma separated famous books",
				},
			],
			model: "mixtral-8x7b-32768",
		});
		const chatContent = chatCompletion.choices[0].message.content;
		console.log("Chat Content: " + JSON.stringify(chatContent));
		words = chatContent.split(",").map((word: string) => word.trim());

		this.wordArray = words;
		console.log("Word Array: " + JSON.stringify(words));
		// const resp = chatCompletion.choices[0].message.content;
		return words;
	}
}

ExtremeWordsServer satisfies Party.Worker;
