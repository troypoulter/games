/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { usePartySocket } from "partysocket/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Select from "@/components/ui/Select";
import { PARTYKIT_HOST } from "@/lib/env";

const DealButton = ({ cardsToDeal, onClick }: any) => {
	return (
		<Button
			className="bg-green-500 px-8 hover:bg-green-500/90"
			onClick={() => onClick(cardsToDeal)}
		>
			<div>
				<div>DEAL CARDS</div>
			</div>
		</Button>
	);
};

const Keyboard = ({ cards, onClick, gameState }: any) => {
	return (
		<div>
			<div className="row flex justify-center">
				{cards.map((number: string) => (
					<Button
						className="m-2 px-4 py-6"
						key={number}
						disabled={gameState != "play"}
						onClick={() => onClick(number)}
					>
						<div>{number}</div>
					</Button>
				))}
			</div>
		</div>
	);
};

export default function TheMindGame({ gameId }: { gameId: string }) {
	const room = gameId;
	const playerName = localStorage.getItem("userName") || "Fred";
	const cardOptions = ["1", "2", "3", "4", "5", "6", "7"];
	const initialized = useRef(false);
	const [numbers, setNumbers] = useState<string[]>([]);
	const [cardsToDeal, setCardsToDeal] = useState<string>("2");
	const [totalCards, setTotalCards] = useState();
	const [text, setText] = useState<string[]>([]);
	const [playedCards, setPlayedCards] = useState(0);
	const [cards, setCards] = useState<string[]>([]);
	const [ws, setWs] = useState<WebSocket>();

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			console.log("Starting up");
			const ws2 = new WebSocket(
				`wss://kke8tbr1y5.execute-api.ap-southeast-2.amazonaws.com/test?room=${room}`,
			);
			setWs(ws2);
		}
	}, [room]);

	if (!ws) {
		return <div>Loading...</div>;
	}

	const handleDeal = (numCards: any) => {
		console.log(`Attempting to deal: ${numCards} cards`);
		const jsonData = { action: "deal", room: room, numCards: cardsToDeal };
		ws.send(JSON.stringify(jsonData));
	};

	const handleKeyPress = (number: string) => {
		console.log(number + " pressed");
		const jsonData = {
			action: "playCard",
			card: number,
			player: playerName,
			room: room,
		};
		ws.send(JSON.stringify(jsonData));

		// remove from cards
		const newCards = [...cards];
		const index = newCards.indexOf(number);
		if (index > -1) {
			newCards.splice(index, 1);
		}
		setCards(newCards);
	};

	ws.onmessage = function (event) {
		const response = JSON.parse(event.data);
		if (response.handler == "deal") {
			console.log("Getting a deal back");
			console.log("Cards: " + response.cards);
			console.log("Total Cards: " + response.totalCards);
			setCards([]);
			setCards(response.cards);
			setTotalCards(response.totalCards);
			setNumbers([]);
			setText([]);
			setPlayedCards(0);
		}
		if (response.handler == "playCard") {
			const newPlayedCards = playedCards + 1;
			setPlayedCards(newPlayedCards);
			console.log("Message returned: playing number");
			const number = response.card;
			const player = response.player;
			const newNumbers = [...numbers];
			newNumbers.push(number);
			setNumbers(newNumbers);
			const newText = [...text];
			const newLine = `${player} played: ${number}`;
			newText.push(newLine);
			setText(newText);
		}
	};

	return (
		<div>
			<div className="row flex justify-evenly">
				{room && <div className="">Room: {room}</div>}
				{totalCards && (
					<div className="">
						Cards Played: {playedCards} / {totalCards}
					</div>
				)}
			</div>
			<div className="pt-6">
				{text.map((t, idx) => (
					<div key={idx} className="flex justify-center pt-2">
						{t}
					</div>
				))}
			</div>
			<div className="absolute inset-x-0 bottom-16">
				<Keyboard onClick={handleKeyPress} cards={cards} gameState="play" />
			</div>
			<div className="row absolute inset-x-0 bottom-0 flex justify-evenly">
				<DealButton cardsToDeal={cardsToDeal} onClick={handleDeal} />
				<Select
					defaultValue={cardsToDeal}
					selectItems={cardOptions}
					onChange={setCardsToDeal}
				/>
			</div>
		</div>
	);
}
