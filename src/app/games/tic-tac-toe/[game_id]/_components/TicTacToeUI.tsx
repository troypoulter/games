"use client";

import usePartySocket from "partysocket/react";

import { PARTYKIT_HOST } from "@/lib/env";

export default function TicTacToeUI({ gameId }: { gameId: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "tictactoe",
		onMessage: (message) => console.log(message),
	});

	return <div>Welcome to {gameId}</div>;
}
