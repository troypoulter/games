import type * as Party from "partykit/server";
import { z } from "zod";

import {
	createStandardWebhookMessage,
	parseStandardWebhookMessage,
} from "@/lib/standard-webhook";

import {
	BoardType,
	GameState,
	GameStateSchema,
	PlayerMarkType,
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
				const initialBoard: BoardType = Array.from({ length: 3 }, () =>
					Array.from({ length: 3 }, () => null),
				);

				gameState = {
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
		if (!gameState) return;

		// If the game is already full, exit early and disconnect the incoming connection.
		if (Object.keys(gameState.players).length >= 2) {
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

		await this.room.storage.put<GameState>(GAMESTATE_KEY, gameState);

		this.room.broadcast(
			createStandardWebhookMessage(
				"tictactoe.game.update",
				gameState,
				GameStateSchema,
			),
		);
	}

	async onMessage(message: string, sender: Party.Connection) {
		// Before accepting any messages, ensure there is game state created,
		// if there isn't, exit early.
		const gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);
		if (!gameState) return;

		// Only allow messages if there are enough players connected.
		// TODO: Display a proper error message.
		if (Object.keys(gameState.players).length < 2) {
			return;
		}

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

	private async handleMove(data: unknown, sender: Party.Connection) {
		const gameState = await this.room.storage.get<GameState>(GAMESTATE_KEY);
		if (!gameState) return; // Exit if game state is not found

		// TODO: Return helpful message if game is over
		if (gameState.isDraw || gameState.winner) return;

		// Validate the move data
		const moveResult = MoveDataSchema.safeParse(data);
		if (!moveResult.success) {
			console.error("Invalid move data:", moveResult.error.flatten());
			sender.send("Invalid move data.");
			return;
		}

		// Execute the move
		const { row, col } = moveResult.data;

		if (!gameState || gameState.board[row][col] !== null) {
			sender.send("Invalid move or game state.");
			return;
		}

		if (!gameState.currentPlayer) {
			sender.send("Invalid move or game state.");
			return;
		}

		if (gameState.currentPlayer.id !== sender.id) {
			sender.send("Invalid move or game state.");
			return;
		}

		// Update the board with the current player's mark
		gameState.board[row][col] = gameState.currentPlayer.mark;

		// Check for a winner or if the board is full
		if (this.checkWinner(gameState.board, gameState.currentPlayer.mark)) {
			gameState.winner = gameState.currentPlayer;
			await this.room.storage.put(GAMESTATE_KEY, gameState);
			this.room.broadcast(
				createStandardWebhookMessage(
					"tictactoe.game.update",
					gameState,
					GameStateSchema,
				),
			);

			return;
		}

		// Switch the current player to the next player
		const playerIds = Object.keys(gameState.players);
		const nextPlayerId = playerIds.find(
			(id) => id !== gameState.currentPlayer!.id,
		);

		if (!nextPlayerId) {
			console.error("Next player not found. Check game state integrity.");
			return;
		}

		gameState.currentPlayer = gameState.players[nextPlayerId];

		// Check if the board is full (draw condition)
		const isBoardFull = gameState.board.every((row) =>
			row.every((cell) => cell !== null),
		);

		if (isBoardFull) {
			gameState.isDraw = true;
			await this.room.storage.put(GAMESTATE_KEY, gameState);
			this.room.broadcast(
				createStandardWebhookMessage(
					"tictactoe.game.update",
					gameState,
					GameStateSchema,
				),
			);
			return;
		}

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

	private checkWinner(board: BoardType, playerMark: PlayerMarkType): boolean {
		const winConditions = [
			[board[0][0], board[0][1], board[0][2]],
			[board[1][0], board[1][1], board[1][2]],
			[board[2][0], board[2][1], board[2][2]],
			[board[0][0], board[1][0], board[2][0]],
			[board[0][1], board[1][1], board[2][1]],
			[board[0][2], board[1][2], board[2][2]],
			[board[0][0], board[1][1], board[2][2]],
			[board[2][0], board[1][1], board[0][2]],
		];

		return winConditions.some((line) =>
			line.every((cell) => cell === playerMark),
		);
	}
}

TicTacToeServer satisfies Party.Worker;
