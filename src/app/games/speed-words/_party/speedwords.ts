/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type * as Party from "partykit/server";

import {
	getLetters,
	initLetterPool,
} from "../[game_id]/_components/letterFunctions";

export default class SpeedWordsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	gamePlayers: number = 0;
	token: string = "";
	letterPool: string[] = [];

	// TODO DAN FOLLOW THIS BLOG
	// https://docs.partykit.io/guides/using-multiple-parties-per-project/#example-tracking-connections-across-rooms

	// eslint-disable-next-line @typescript-eslint/require-await
	async onStart() {
		console.log("Partykit server starting up");
	}

	// onConnect(connection: Party.Connection) {
	// 	console.log("Got to onConnect: " + JSON.stringify(connection));
	// 	// // when a new client connects, send them letters
	// 	// const newLetters = getLetters(7, this.letterPool);
	// 	// const response = {
	// 	// 	message: "peel",
	// 	// 	data: { letters: newLetters },
	// 	// };
	// 	// connection.send(JSON.stringify(response));
	// 	// this.broadcastLettersLeft();
	// }

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
					`Game of Speed Words exists, returning game! There are ${this.gamePlayers} players`,
				);
			} else {
				this.gameExists = true;
				console.log(
					`Game of Speed Words does not exist, creating game! There are ${this.gamePlayers} players`,
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

	// eslint-disable-next-line @typescript-eslint/require-await
	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		console.log("Got to message in Speed Words");
		if (message === "peel") {
			this.peel();
		}
		if (message === "startGame") {
			this.startGame();
		}
	}

	startGame() {
		this.letterPool = initLetterPool();
		const connections: Iterable<Party.Connection<unknown>> =
			this.room.getConnections();
		const connectionsArray = Array.from(connections);
		for (const connection of connectionsArray) {
			const newLetters = getLetters(7, this.letterPool);
			const response = { message: "peel", data: { letters: newLetters } };
			connection.send(JSON.stringify(response));
		}

		this.broadcastLettersLeft();
		const response = { message: "startGame" };
		this.room.broadcast(JSON.stringify(response));
	}

	peel() {
		const connections: Iterable<Party.Connection<unknown>> =
			this.room.getConnections();
		const connectionsArray = Array.from(connections);
		for (const connection of connectionsArray) {
			const newLetters = getLetters(3, this.letterPool);
			const response = { message: "peel", data: { letters: newLetters } };
			connection.send(JSON.stringify(response));
		}
		this.broadcastLettersLeft();
	}

	broadcastLettersLeft() {
		const response = {
			message: "lettersLeft",
			data: { lettersLeft: this.letterPool.length },
		};
		this.room.broadcast(JSON.stringify(response));
	}
}

SpeedWordsServer satisfies Party.Worker;
