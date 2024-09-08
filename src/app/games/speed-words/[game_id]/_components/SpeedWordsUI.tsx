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

import {
	getLetters,
	handleBackspacePress,
	handleLetterPress,
	handlePeel,
	initLetterPool,
} from "./letterFunctions";
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
	const [letterPool, setLetterPool] = useState<any>(() => initLetterPool());
	const [autoDirect, setAutoDirect] = useState("→");
	const [keyboardLetters, setKeyBoardLetters] = useState<any>();

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "speedwords",
	});

	useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollTo({
				top: selectedCell[0] * 48 - 96,
				left: selectedCell[1] * 48 - 96,
				behavior: "auto",
			});
		}
		console.log("setting keyboard letters");
		if (!initialized.current) {
			initialized.current = true;
			const initLetters = getLetters(9, letterPool, setLetterPool);
			setKeyBoardLetters(initLetters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	socket.onmessage = (response) => {
		const mess = JSON.parse(response.data);
		if (mess.message === "startGame") {
			console.log("Starting the game!");
		}
	};

	const changeCell = (row: any, col: any) => {
		const cellNum = [row, col];
		// if (divRef.current) {
		// 	divRef.current.scrollTo({
		// 		top: cellNum[0] * 48 - 96,
		// 		left: cellNum[1] * 48 - 96,
		// 		behavior: "smooth",
		// 	});
		// }
		//TODO Not sure whether to auto scroll? can be a bit headachey...
		setSelectedCell(cellNum);
	};

	const handleKeyPress = (letter: string, idx: number) => {
		console.log("Letter is: " + letter);
		if (letter == "PEEL") {
			console.log("Peeling now");
			handlePeel(
				keyboardLetters,
				setKeyBoardLetters,
				letterPool,
				setLetterPool,
			);
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