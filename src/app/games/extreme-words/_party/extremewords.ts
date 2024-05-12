/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type * as Party from "partykit/server";
import { generate } from "random-words";

import { rules } from "./rules";

export default class ExtremeWordsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;

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

	// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any
	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		if (message === "startGame") {
			const rule = rules[Math.floor(Math.random() * rules.length)];
			const data = { player: requestJson.player, rule: rule.rule };
			const response = { message: "startGame", data: data };
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "getWord") {
			const word = generate({ minLength: 3 }) as string;
			const response = { message: "getWord", data: word };
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "prevWords") {
			console.log("Previous words are: " + message.data);
			// const response = { message: "prevWords", data: message.data };
			this.room.broadcast(request);
		} else {
			console.log("Message is not getWord");
		}
	}
}

ExtremeWordsServer satisfies Party.Worker;
