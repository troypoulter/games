"use client";

import { Loader2, Play } from "lucide-react";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { z } from "zod";

import InviteButton from "@/components/InviteButton";
import { Button } from "@/components/ui/button";
import { PARTYKIT_HOST } from "@/lib/env";
import {
	createStandardWebhookMessage,
	parseStandardWebhookMessage,
} from "@/lib/standard-webhook";

import { GameState, GameStateSchema } from "../../_types/game-state";
import { MoveDataSchema } from "../../_types/move-data";

export default function TicTacToeUI({
	gameId,
	connectionId,
}: {
	connectionId?: string;
	gameId: string;
}) {
	const [gameState, setGameState] = useState<GameState>();
	const [isGameFull, setIsGameFull] = useState(false);

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "tictactoe",
		id: connectionId !== undefined ? connectionId : undefined,
		onMessage: (message) => {
			const webhookMessage = parseStandardWebhookMessage(
				message.data as string,
				z.unknown(),
			);

			if (webhookMessage instanceof z.ZodError) {
				console.error("Failed to validate message:", webhookMessage.flatten());
				return;
			}

			if (webhookMessage.type === "tictactoe.game.full") {
				setIsGameFull(true);
				socket.close();
				return;
			}

			setIsGameFull(false);

			if (webhookMessage.type === "tictactoe.game.update") {
				const webhookGameState = parseStandardWebhookMessage(
					message.data as string,
					GameStateSchema,
				);

				if (webhookGameState instanceof z.ZodError) {
					console.error(
						"Failed to validate message:",
						webhookGameState.flatten(),
					);
					return;
				}

				setGameState(webhookGameState.data);
			}
		},
	});

	const setSelectedCell = (row: number, col: number) => {
		if (!gameState?.board) return;

		if (gameState.board[row][col] === null) {
			const move = MoveDataSchema.parse({ row, col });
			const moveMessage = createStandardWebhookMessage(
				"tictactoe.move.made",
				move,
				MoveDataSchema,
			);
			socket.send(moveMessage);
		}
	};

	const handleNewGame = () => {
		socket.send(
			createStandardWebhookMessage(
				"tictactoe.game.newGame",
				undefined,
				undefined,
			),
		);
	};

	if (isGameFull) {
		return <div>Game is full</div>;
	}

	if (!gameState) {
		return <div>Loading...</div>;
	}

	if (Object.keys(gameState.players).length <= 1) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4">
				<h2 className="flex flex-row items-center justify-center text-3xl font-semibold">
					<Loader2 className="mr-2 animate-spin" />
					Waiting for the other player to join
				</h2>
				<InviteButton />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="grid grid-cols-3 gap-2">
				{gameState.board.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<div
							key={`${rowIndex}-${colIndex}`}
							className="flex h-20 w-20 cursor-pointer items-center justify-center bg-gray-200 text-2xl hover:bg-gray-300"
							onClick={() => setSelectedCell(rowIndex, colIndex)}
						>
							{cell}
						</div>
					)),
				)}
			</div>
			<div className="mt-4 text-center">
				Current turn: {gameState.currentPlayer?.mark}
			</div>
			{gameState.winner && (
				<div className="mt-4 text-center">Winner: {gameState.winner.mark}</div>
			)}
			{gameState.isDraw && <div className="mt-4 text-center">Draw</div>}
			{gameState.isDraw ||
				(gameState.winner && (
					<Button
						className="mt-4 bg-green-500 hover:bg-green-500/90"
						onClick={handleNewGame}
					>
						<Play size={22} className="mr-2" /> New Game
					</Button>
				))}
		</div>
	);
}
