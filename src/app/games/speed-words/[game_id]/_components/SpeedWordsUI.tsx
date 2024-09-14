/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
// import SpotifyPlayer from "react-spotify-web-playback";
import { PARTYKIT_HOST } from "@/lib/env";

import SpeedWordsBoard from "./SpeedWordsBoard";
import { Keyboard } from "./SpeedWordsKeyboard";

export default function SpeedWordsUI({ gameId }: { gameId: string }) {
	const room = gameId;
	const initialized = useRef(false); // as Strict Mode is on useEffect gets called twice on init
	const divRef = useRef<HTMLDivElement>(null);

	const [selectedCell, setSelectedCell] = useState([15, 15]);
	const [letterGrid, setLetterGrid] = useState();
	const [autoDirect, setAutoDirect] = useState("→");
	const [keyboardLetters, setKeyBoardLetters] = useState<any>([]);
	const [gameRunning, setGameRunning] = useState<boolean>(false);
	const [lettersLeft, setLettersLeft] = useState<number>(0);
	const [color, setColor] = useState<string>();

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "speedwords",
	});

	useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollTo({
				top: selectedCell[0] * 36 - 200,
				left: selectedCell[1] * 36 - 200,
				behavior: "auto",
			});
		}
	}, [gameRunning, selectedCell]);

	socket.onmessage = (response) => {
		const mess = JSON.parse(response.data);
		if (mess.message === "peel") {
			handlePeel(mess.data.letters);
		}
		if (mess.message === "lettersLeft") {
			setLettersLeft(mess.data.lettersLeft);
		}
		if (mess.message === "startGame") {
			setLetterGrid(mess.data.letterGrid);
			console.log("Color is: " + mess.data.color);
			setColor(mess.data.color);
			handlePeel(mess.data.letters);
			setGameRunning(true);
		}
		if (mess.message === "letterGridUpdate") {
			setLetterGrid(mess.data.letterGrid);
		}
	};

	const handlePeel = (letters: any) => {
		const newLetters = letters;
		console.log("New Letters: " + JSON.stringify(newLetters));
		const allLetters = keyboardLetters.concat(newLetters);
		setKeyBoardLetters(allLetters);
	};

	const sendLetter = (letter: string) => {
		const data = { letter: letter, selectedCell: selectedCell, color: color };
		socket.send(JSON.stringify({ message: "playLetter", data: data }));
	};

	const sendPeel = () => {
		const data = { uniqueId: 123 };
		socket.send(JSON.stringify({ message: "peel", data: data }));
	};

	const sendStartGame = () => {
		const data = { uniqueId: 123 };
		socket.send(JSON.stringify({ message: "startGame", data: data }));
	};

	const sendBackSpace = () => {
		const data = { selectedCell: selectedCell, color: color };
		socket.send(JSON.stringify({ message: "backspace", data: data }));
		autoMove(selectedCell, autoDirect, true);
	};

	const autoMove = (
		selectedCell: any,
		autoDirect: string,
		isbackspace: boolean,
	) => {
		const idx = isbackspace ? -1 : 1;
		const newCellNum = selectedCell;
		if (autoDirect == "→") {
			if (newCellNum[1] < 39) {
				newCellNum[1] = selectedCell[1] + idx;
			}
		} else {
			if (newCellNum[0] < 39) {
				newCellNum[0] = selectedCell[0] + idx;
			}
		}
		setSelectedCell(newCellNum);
	};

	const handleKeyPress = (letter: string, idx: number) => {
		console.log("Letter is: " + letter);
		sendLetter(letter);
		keyboardLetters.splice(idx, 1);
		setKeyBoardLetters(keyboardLetters);
		autoMove(selectedCell, autoDirect, false);
	};

	return (
		<div>
			{!gameRunning && (
				<>
					<div className="flex items-center justify-center">
						Welcome to Speed Words
					</div>
					<div className="mt-6 flex flex-col items-center">
						<Button
							className={`transform bg-green-500 px-4 hover:bg-green-500/90`}
							onClick={() => sendStartGame()}
						>
							<div className="flex items-center">Start Round</div>
						</Button>
					</div>
				</>
			)}
			{gameRunning && (
				<>
					<div ref={divRef} className="h-[400px] overflow-scroll">
						<SpeedWordsBoard
							letterGrid={letterGrid}
							selectedCell={selectedCell}
							setSelectedCell={setSelectedCell}
						/>
					</div>
					<Keyboard
						letters={keyboardLetters}
						onKeyPress={handleKeyPress}
						autoDirect={autoDirect}
						setAutoDirect={setAutoDirect}
						sendPeel={sendPeel}
						color={color}
						handleBackSpace={sendBackSpace}
					/>
					<div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
						Letters Left: {lettersLeft}
					</div>
				</>
			)}
		</div>
	);
}
