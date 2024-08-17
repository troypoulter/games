/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type * as Party from "partykit/server";

import { GEMINI_API_KEY } from "@/lib/env";

const API_KEY: string = GEMINI_API_KEY;

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	// Set the `responseMimeType` to output JSON
	generationConfig: { responseMimeType: "application/json" },
});

export default class MusicQuizServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	gamePlayers: number = 0;
	token: string = "";

	// TODO DAN FOLLOW THIS BLOG
	// https://docs.partykit.io/guides/using-multiple-parties-per-project/#example-tracking-connections-across-rooms

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
			this.gamePlayers++;
			if (this.gameExists) {
				console.log(
					`Game of Music Quiz exists, returning game! There are ${this.gamePlayers} players`,
				);
			} else {
				this.gameExists = true;
				console.log(
					`Game of Music Quiz does not exist, creating game! There are ${this.gamePlayers} players`,
				);
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
		console.log("Got to message in Music Quiz");
		const token: string = requestJson.data.token;
		this.token = token;
		if (message === "getSongs") {
			console.log("Got the getSong message in Music Quiz");
			await this.getSongs();
		}
	}

	async getSongs() {
		console.log("Getting song now!");
		const endpoint =
			"https://api.spotify.com/v1/search?type=track&q=artist:Yellowcard";
		const headers = new Headers({
			Authorization: `Bearer ${this.token}`,
			"Content-Type": "application/json",
		});

		await fetch(endpoint, { headers })
			.then((response) => response.json())
			.then((data) => console.log(JSON.stringify(data)))
			.catch((error) => console.error("Error:", error));
	}

	async getSongsFromGemini() {
		try {
			const prompt = `
				List the name of 20 popular Yellowcard songs. Using this JSON schema:
				Song = {"song": string}
				Return a list[Song]
			`;

			const result = await model.generateContent(prompt);
			const promptText: string = result.response.text();
			const jsonResponse = JSON.parse(promptText);
			console.log(jsonResponse);

			// const arrayOfStrings2 = jsonResponse.map(
			// 	(item: { thing: string }) => item.thing,
			// );
			// this.wordArray = arrayOfStrings2;
		} catch (error) {
			console.log("Error getting words: " + JSON.stringify(error));
		}
	}
}

MusicQuizServer satisfies Party.Worker;
