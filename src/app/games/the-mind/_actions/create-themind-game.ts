"use client";

import { redirect } from "next/navigation";

// import { PARTYKIT_URL } from "@/lib/env";

// Inspired from: https://github.com/ProNextJS/forms-management-yt/blob/main/forms-mgmt-finished/src/app/formSubmit.ts

export function createTheMindGame(room: string): void {
	// await fetch(`${PARTYKIT_URL}/parties/themind/${room}`, {
	// 	method: "POST",
	// 	body: JSON.stringify("hello there"),
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// });

	redirect(`/games/the-mind/${room}`);
}