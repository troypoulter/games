import type * as Party from "partykit/server";
import { z } from "zod";

import {
	createStandardWebhookMessage,
	parseStandardWebhookMessage,
} from "@/lib/standard-webhook";

import {
	BoardSchema,
	GameState,
	GameStateSchema,
	PlayerSchema,
} from "../_types/game-state";
import { MoveDataSchema } from "../_types/move-data";

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
					winner: null,
					isDraw: null,
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
			const newPlayer = PlayerSchema.parse({
				id: connection.id,
				name: `Player ${Object.keys(gameState.players).length + 1}`,
				mark: Object.keys(gameState.players).length === 0 ? "X" : "O",
			});

			gameState.players[connection.id] = newPlayer;

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

	async onMessage(message: string, sender: Party.Connection) {
		// Parse and validate the message
		const parseResult = parseStandardWebhookMessage(message, z.unknown());
		if (parseResult instanceof z.ZodError) {
			console.error("Failed to validate message:", parseResult.flatten());
			sender.send("Error in message format.");
			return;
		}

		// Handle the message based on its type
		switch (parseResult.type) {
			case "tictactoe.move.made":
				await this.handleMove(parseResult.data, sender);
				break;
			default:
				console.log(
					"Received an unsupported type of message:",
					parseResult.type,
				);
				break;
		}
	}

	async handleMove(data: unknown, sender: Party.Connection) {
		// Validate the move data
		const moveResult = MoveDataSchema.safeParse(data);
		if (!moveResult.success) {
			console.error("Invalid move data:", moveResult.error.flatten());
			sender.send("Invalid move data.");
			return;
		}

		// Execute the move
		const { row, col } = moveResult.data;
		const gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);
		if (!gameState || gameState.board[row][col] !== null) {
			sender.send("Invalid move or game state.");
			return;
		}

		if (!gameState.currentPlayer) {
			sender.send("Invalid move or game state.");
			return;
		}

		// Update the board and check for game over or switch player
		gameState.board[row][col] = gameState.currentPlayer.mark;
		// Simplified logic, consider game over check and switching current player
		await this.room.storage.put(GAMESTATE_KEY, gameState);

		// Broadcast the updated game state to all clients
		this.room.broadcast(
			createStandardWebhookMessage(
				"tictactoe.game.update",
				gameState,
				GameStateSchema,
			),
		);
	}
}

TicTacToeServer satisfies Party.Worker;
