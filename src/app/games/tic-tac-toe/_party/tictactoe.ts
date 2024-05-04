import type * as Party from "partykit/server";
import { z } from "zod";

import { createStandardWebhookMessage } from "@/lib/standard-webhook";

import {
	BoardSchema,
	GameState,
	GameStateSchema,
	PlayerSchema,
} from "../_types/game-state";

const GAMESTATE_KEY = "gameState";

export default class TicTacToeServer implements Party.Server {
	constructor(readonly room: Party.Room) {}

	async onRequest(req: Party.Request) {
		if (req.method === "POST") {
			let gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);

			if (!gameState) {
				const initialBoard: z.infer<typeof BoardSchema> = Array.from(
					{ length: 3 },
					() => Array.from({ length: 3 }, () => null),
				);

				gameState = {
					hasGameStarted: false,
					players: {},
					board: initialBoard,
					currentPlayer: null,
				};

				await this.room.storage.put(GAMESTATE_KEY, gameState);

				return new Response("New game room created.", { status: 200 });
			} else {
				console.log("Game is already in progress.");
				return new Response(JSON.stringify(gameState), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		const gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);
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

	async onConnect(connection: Party.Connection) {
		const gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);
		if (!gameState) return; // Exit if game state is not found

		if (
			!gameState.hasGameStarted &&
			Object.keys(gameState.players).length < 2
		) {
			const newPlayer = {
				id: connection.id,
				name: `Player ${Object.keys(gameState.players).length + 1}`,
			};

			gameState.players[connection.id] = PlayerSchema.parse(newPlayer);

			// Set the current player if it's the first player joining
			if (!gameState.currentPlayer) {
				gameState.currentPlayer = newPlayer;
			}

			await this.room.storage.put(GAMESTATE_KEY, gameState);

			this.room.broadcast(
				createStandardWebhookMessage(
					"tictactoe.player.connected",
					gameState,
					GameStateSchema,
				),
			);
		} else {
			connection.send(
				createStandardWebhookMessage(
					"tictactoe.game.full",
					undefined,
					undefined,
				),
			);
			connection.close();
			return;
		}
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
