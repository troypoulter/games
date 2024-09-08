"use server";

import { redirect } from "next/navigation";

import { PARTYKIT_URL } from "@/lib/env";

// Inspired from: https://github.com/ProNextJS/forms-management-yt/blob/main/forms-mgmt-finished/src/app/formSubmit.ts

export async function createSpeedWordsGame(room: string): Promise<void> {
	try {
		await fetch(`${PARTYKIT_URL}/parties/speedwords/${room}`, {
			method: "POST",
			body: JSON.stringify("hello there"),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch {
		console.log("Failed joining speed words room");
	}
	console.log("Redirecting to Speed Words room");
	redirect(`/games/speed-words/${room}`);
}
