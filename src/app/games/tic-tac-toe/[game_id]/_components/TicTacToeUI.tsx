"use client";

import usePartySocket from "partysocket/react";
import { useState } from "react";
import { z } from "zod";

import { PARTYKIT_HOST } from "@/lib/env";
import {
	createStandardWebhookMessage,
	parseStandardWebhookMessage,
} from "@/lib/standard-webhook";

import { BoardType, GameStateSchema } from "../../_types/game-state";
import { MoveDataSchema } from "../../_types/move-data";

export default function TicTacToeUI({ gameId }: { gameId: string }) {
	const [board, setBoard] = useState<BoardType>();
	const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | undefined>(
		undefined,
	);

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "tictactoe",
		onMessage: (message) => {
			console.log("Received message:", message.data);
			const webhookMessage = parseStandardWebhookMessage(
				message.data as string,
				z.unknown(),
			);
			if (webhookMessage instanceof z.ZodError) {
				console.error("Failed to validate message:", webhookMessage.flatten());
				return;
			}

			if (webhookMessage.type === "tictactoe.game.full") {
				socket.close();
				return;
			}

			if (
				webhookMessage.type === "tictactoe.move.made" ||
				webhookMessage.type === "tictactoe.game.update" ||
				webhookMessage.type === "tictactoe.player.connected" ||
				webhookMessage.type === "tictactoe.game.finished"
			) {
				const gameState = GameStateSchema.parse(webhookMessage.data);
				setBoard(gameState.board);
				setCurrentPlayer(gameState.currentPlayer?.mark);
			}
		},
	});

	const handleCellClick = (row: number, col: number) => {
		if (!board) return;

		if (board[row][col] === null && currentPlayer) {
			const move = MoveDataSchema.parse({ row, col });
			const moveMessage = createStandardWebhookMessage(
				"tictactoe.move.made",
				move,
				MoveDataSchema,
			);
			socket.send(moveMessage);
		}
	};

	if (!board) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex items-center justify-center">
			<div className="grid grid-cols-3 gap-2">
				{board.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<div
							key={`${rowIndex}-${colIndex}`}
							className="flex h-20 w-20 cursor-pointer items-center justify-center bg-gray-200 text-2xl hover:bg-gray-300"
							onClick={() => handleCellClick(rowIndex, colIndex)}
						>
							{cell}
						</div>
					)),
				)}
				<div className="col-span-3 mt-4 text-center">
					Current turn: {currentPlayer}
				</div>
			</div>
		</div>
	);
}
