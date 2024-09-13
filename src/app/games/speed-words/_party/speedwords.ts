/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type * as Party from "partykit/server";

import {
	getColor,
	getLetters,
	initLetterGrid,
	initLetterPool,
} from "../[game_id]/_components/letterFunctions";

export interface Player {
	color: string;
	connection: Party.Connection;
}

export default class SpeedWordsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	gamePlayers: number = 0;
	token: string = "";
	letterPool: string[] = [];
	letterGrid: any = {};
	colors: string[] = [
		"bg-red-500",
		"bg-orange-500",
		"bg-yellow-500",
		"bg-amber-500",
		"bg-lime-500",
		"bg-green-500",
		"bg-blue-500",
		"bg-cyan-500",
		"bg-rose-500",
		"bg-indigo-500",
		"bg-violet-500",
		"bg-pink-500",
		"bg-fuchsia-500",
		"bg-purple-500",
	];
	players: Player[] = [];

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
		if (message === "playLetter") {
			this.playLetter(requestJson.data);
		}
		if (message === "backspace") {
			this.backspace(requestJson.data);
		}
	}

	startGame() {
		// TODO pass through settings. If each playing on own board, then just make individual play grids for each person and return those
		this.letterPool = initLetterPool();
		const initLetter = getLetters(1, this.letterPool);
		this.letterGrid = initLetterGrid(initLetter[0]);
		const connections: Iterable<Party.Connection<unknown>> =
			this.room.getConnections();
		const connectionsArray = Array.from(connections);
		for (const connection of connectionsArray) {
			const color = getColor(this.colors);
			const newLetters = getLetters(7, this.letterPool);
			const response = {
				message: "startGame",
				data: {
					letterGrid: this.letterGrid,
					letters: newLetters,
					color: color,
				},
			};
			connection.send(JSON.stringify(response));
			this.players.push({
				color: color,
				connection: connection,
			});
		}
		this.broadcastLettersLeft();
	}

	playLetter(data: any) {
		const letterGrid = this.letterGrid;
		const letter = data.letter;
		const selectedCell = data.selectedCell;
		const letterFromGrid = letterGrid[selectedCell[0]][selectedCell[1]]?.letter;
		this.sendExistingLetterBack(data.color, letterFromGrid);
		letterGrid[selectedCell[0]] = letterGrid[selectedCell[0]] ?? {};
		letterGrid[selectedCell[0]][selectedCell[1]] = {
			letter: letter,
			color: data.color,
		};
		this.letterGrid = letterGrid;
		const response = {
			message: "letterGridUpdate",
			data: { letterGrid: this.letterGrid },
		};
		console.log("Letter Grid: " + JSON.stringify(letterGrid));
		this.room.broadcast(JSON.stringify(response));
	}

	sendExistingLetterBack(color: string, letterFromGrid: string) {
		// Send letter back to original player
		if (letterFromGrid && letterFromGrid != "") {
			for (const player of this.players) {
				const response = {
					message: "peel",
					data: { letters: [letterFromGrid] },
				};
				if (player.color == color) {
					player.connection.send(JSON.stringify(response));
				}
			}
		}
	}

	backspace(data: any) {
		// Update Letter grid and send to all
		const selectedCell = data.selectedCell;
		const letterGrid = this.letterGrid;
		const letterFromGrid = letterGrid[selectedCell[0]][selectedCell[1]]?.letter;
		this.sendExistingLetterBack(data.color, letterFromGrid);
		letterGrid[selectedCell[0]] = letterGrid[selectedCell[0]] ?? {};
		letterGrid[selectedCell[0]][selectedCell[1]] = null;
		this.letterGrid = letterGrid;
		const response = {
			message: "letterGridUpdate",
			data: { letterGrid: this.letterGrid },
		};
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
