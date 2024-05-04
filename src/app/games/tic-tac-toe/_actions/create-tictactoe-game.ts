/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

import { PARTYKIT_URL } from "@/lib/env";

// Inspired from: https://github.com/ProNextJS/forms-management-yt/blob/main/forms-mgmt-finished/src/app/formSubmit.ts
export type FormState = {
	fields?: Record<string, string>;
	issues?: string[];
	message: string;
};

export async function createTicTacToeGame(
	prevState: FormState,
	data: FormData,
): Promise<FormState> {
	const id = nanoid(10);

	await fetch(`${PARTYKIT_URL}/parties/tictactoe/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	redirect(`/games/tic-tac-toe/${id}`);
}
