/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useRef, useState } from "react";

// import SpotifyPlayer from "react-spotify-web-playback";
import { PARTYKIT_HOST } from "@/lib/env";

import { handleBackspacePress, handleLetterPress } from "./letterFunctions";
import SpeedWordsBoard from "./SpeedWordsBoard";
import { Keyboard } from "./SpeedWordsKeyboard";

const initLetterGrid = () => {
	const letterGrid = {
		0: {},
		1: {},
		2: {},
		3: {},
		4: {},
		5: {},
		6: {},
		7: {},
		8: {},
		9: {},
		10: {},
		11: {},
		12: {},
		13: {},
		14: {},
		15: {},
		16: {},
		17: {},
		18: {},
		19: {},
		20: {},
		21: {},
		22: {},
		23: {},
		24: {},
		25: {},
		26: {},
		27: {},
		28: {},
		29: {},
		30: {},
		31: {},
		32: {},
		33: {},
		34: {},
		35: {},
		36: {},
		37: {},
		38: {},
		39: {},
	};
	return letterGrid;
};

export default function SpeedWordsUI({ gameId }: { gameId: string }) {
	const room = gameId;
	const initialized = useRef(false); // as Strict Mode is on useEffect gets called twice on init
	const divRef = useRef<HTMLDivElement>(null);

	const [selectedCell, setSelectedCell] = useState([15, 15]);
	const [letterGrid, setLetterGrid] = useState(() => initLetterGrid());
	const [autoDirect, setAutoDirect] = useState("→");
	const [keyboardLetters, setKeyBoardLetters] = useState<any>([]);

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "speedwords",
	});

	useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollTo({
				top: selectedCell[0] * 44 - 88,
				left: selectedCell[1] * 44 - 88,
				behavior: "auto",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	socket.onmessage = (response) => {
		const mess = JSON.parse(response.data);
		if (mess.message === "peel") {
			console.log("Peeling from Partykit");
			console.log("Response: " + JSON.stringify(mess));
			handlePeel(mess.data.letters);
		}
	};

	const changeCell = (row: any, col: any) => {
		const cellNum = [row, col];
		if (divRef.current) {
			divRef.current.scrollTo({
				top: cellNum[0] * 44 - 150,
				left: cellNum[1] * 44 - 150,
				behavior: "smooth",
			});
		}
		//TODO Not sure whether to auto scroll? can be a bit headachey...
		setSelectedCell(cellNum);
	};

	const handlePeel = (letters: any) => {
		const newLetters = letters;
		console.log("New Letters: " + JSON.stringify(newLetters));
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const allLetters = keyboardLetters.concat(newLetters);
		setKeyBoardLetters(allLetters);
	};

	const sendPeel = () => {
		const data = { uniqueId: 123 };
		socket.send(JSON.stringify({ message: "peel", data: data }));
	};

	const handleKeyPress = (letter: string, idx: number) => {
		console.log("Letter is: " + letter);
		if (letter == "PEEL") {
			console.log("Peeling now");
			sendPeel();
			return;
		} else if (letter == "⌫") {
			handleBackspacePress(
				autoDirect,
				selectedCell,
				letterGrid,
				setLetterGrid,
				changeCell,
				keyboardLetters,
				setKeyBoardLetters,
			);
			return;
		} else {
			handleLetterPress(
				autoDirect,
				selectedCell,
				letter,
				letterGrid,
				setLetterGrid,
				changeCell,
				keyboardLetters,
				setKeyBoardLetters,
				idx,
			);
		}
	};

	return (
		<div>
			<div className="flex items-center justify-center">
				Welcome to Speed Words
			</div>
			<div ref={divRef} className="h-[400px] overflow-scroll">
				<SpeedWordsBoard
					letterGrid={letterGrid}
					selectedCell={selectedCell}
					changeCell={changeCell}
				/>
			</div>
			{keyboardLetters && (
				<Keyboard
					letters={keyboardLetters}
					onKeyPress={handleKeyPress}
					autoDirect={autoDirect}
					setAutoDirect={setAutoDirect}
				/>
			)}
		</div>
	);
}
