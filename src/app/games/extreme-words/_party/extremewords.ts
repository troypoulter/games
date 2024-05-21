/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Groq from "groq-sdk";
import type * as Party from "partykit/server";
import { generate } from "random-words";

// import { natureWords } from "./nature";
import { rules } from "./rules";

const groq = new Groq({
	apiKey: "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",
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
			const category: string = requestJson.data.category;
			const rule = rules[Math.floor(Math.random() * rules.length)];
			const data = {
				player: requestJson.data.player,
				rule: rule.rule,
				uniqueId: requestJson.data.uniqueId,
			};
			const response = { message: "startGame", data: data };
			let words = await this.generateWords(category);
			if (words.length < 10) {
				words = generate({ exactly: 30 }) as string[];
			}
			this.wordArray = words;
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "getWord") {
			console.log("Data: " + JSON.stringify(requestJson.data));
			const array = this.wordArray;
			const idx = Math.floor(Math.random() * array.length);
			const word = array[idx];
			array.splice(idx, 1);
			const response = { message: "getWord", data: word };
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "prevWords") {
			console.log("Previous words are: " + message.data);
			this.room.broadcast(request);
		} else {
			console.log("Message is not getWord");
		}
	}

	async generateWords(category: string) {
		let words: string[] = ["volcano"];
		console.log("Category: " + category);
		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: `Generate a non cached random list of 50 ${category} words separate by semicolon without any introduction or outro`,
				},
			],
			model: "mixtral-8x7b-32768",
		});
		const chatContent = chatCompletion.choices[0].message.content;
		words = chatContent.split(";");
		if (words[0].includes("Sure") || words[0].includes("here is")) {
			// remove initial starting stuff...
			words.splice(0);
		}
		this.wordArray = words;
		console.log("Word Array: " + JSON.stringify(words));

		// const resp = chatCompletion.choices[0].message.content;
		return words;
	}
}

ExtremeWordsServer satisfies Party.Worker;
