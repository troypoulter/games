/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";

import Select from "@/components/ui/Select";

export default function TheMindGame({ gameId }: { gameId: string }) {
	const room = gameId;
	const playerName = localStorage.getItem("userName") || "Fred";
	const cards = ["1", "2", "3", "4", "5", "6", "7"];
	const [cardsToDeal, setCardsToDeal] = useState<string>("2");
	console.log("Cards: " + cardsToDeal);

	return (
		<div>
			Welcome to the Mind! Room: {room} Player: {playerName}
			<Select
				defaultValue={cardsToDeal}
				selectItems={cards}
				onChange={setCardsToDeal}
			/>
		</div>
	);
}
