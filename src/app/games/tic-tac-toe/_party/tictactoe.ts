import type * as Party from "partykit/server";

import { GameState } from "../_types/game-state";

export default class TicTacToeServer implements Party.Server {
	constructor(readonly room: Party.Room) {}

	async onRequest(req: Party.Request) {
		if (req.method === "POST") {
			let gameState = await this.room.storage.get<GameState>("gameState");

			if (!gameState) {
				gameState = {
					hasGameStarted: false,
					players: {},
				};

				await this.room.storage.put("gameState", gameState);

				return new Response("New game room created.", { status: 200 });
			} else {
				console.log("Game is already in progress.");
				return new Response(JSON.stringify(gameState), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		const gameState = await this.room.storage.get<GameState>("gameState");
		if (gameState) {
			console.log("Returning current game state.");
			return new Response(JSON.stringify(gameState), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		console.log("Invalid request - No current game state available.");
		return new Response("Invalid request - No current game state available.", {
			status: 400,
		});
	}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
		);

		// let's send a message to the connection
		conn.send("hello from server");
	}

	onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message}`);
		// as well as broadcast it to all the other connections in the room...
		this.room.broadcast(
			`${sender.id}: ${message}`,
			// ...except for the connection it came from
			[sender.id],
		);
	}
}

TicTacToeServer satisfies Party.Worker;
