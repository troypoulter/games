/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type * as Party from "partykit/server";

import { GEMINI_API_KEY } from "@/lib/env";

import { rules } from "./rules";

const API_KEY = GEMINI_API_KEY;
console.log("API KEY:" + API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	// Set the `responseMimeType` to output JSON
	generationConfig: { responseMimeType: "application/json" },
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
			const words = await this.generateWords(category);
			console.log("Words is: " + JSON.stringify(words));
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
		console.log(category);
		const words: string[] = [];
		try {
			const prompt = `
				List 30 ${category} strings. Using this JSON schema:
				Words = {"thing": string}
				Return a list[Words]
			`;

			const result = await model.generateContent(prompt);
			const promptText: string = result.response.text();
			const jsonResponse = JSON.parse(promptText);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const arrayOfStrings2 = jsonResponse.map(
				(item: { thing: string }) => item.thing,
			);
			this.wordArray = arrayOfStrings2;
		} catch (error) {
			console.log("Error getting words: " + JSON.stringify(error));
		}
		return words;
	}
}

ExtremeWordsServer satisfies Party.Worker;
