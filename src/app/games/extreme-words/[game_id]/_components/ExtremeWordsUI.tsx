/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import Select from "@/components/ui/Select";
import { PARTYKIT_HOST } from "@/lib/env";

import { Word } from "../../_types/word";

interface Times {
	minutes: number;
	seconds: number;
	time: number;
}

export default function ExtremeWordsUI({ gameId }: { gameId: string }) {
	const time = 0;
	const [isActivePlayer, setIsActivePlayer] = useState<boolean>(false);
	const [timeOut, setTimeOut] = useState<NodeJS.Timeout>();
	const [score, setScore] = useState<number>(0);
	const [guessWord, setGuessWord] = useState<string>("");
	const [prevWords, setPrevWords] = useState<Word[]>([]);
	const [gameInProg, setGameInProg] = useState<boolean | undefined>();
	const [activePlayer, setActivePlayer] = useState<string>();
	const [selectedCategory, setSelectedCategory] = useState<string>("Custom");
	const [customCategory, setCustomCategory] = useState<string | undefined>();
	const categories = [
		"Pop Punk Bands",
		"Animals",
		"Famous Quotes",
		"Harry Potter",
		"Random",
		"Nature",
		"Music",
		"Movies",
		"Simpsons",
		"TV Shows",
		"Books",
		"Custom",
	];
	const [times, setTimes] = useState<Times>({
		time,
		seconds: 45,
		minutes: Math.floor((time - 1) / 60),
	});
	const [rule, setRule] = useState<string>();

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: gameId,
		party: "extremewords",
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (times.time === 0) {
				if (gameInProg) {
					setGameInProg(false);
				}
				return;
			}
			setTimes({
				time: times.time - 1,
				minutes: Math.floor((times.time - 1) / 60),
				seconds: times.time - Math.floor((times.time - 1) / 60) * 60 - 1,
			});
		}, 1000);
		setTimeOut(timeoutId);
	}, [times.time]);

	const playerName = localStorage.getItem("userName") || "Fred";

	socket.onmessage = (response) => {
		console.log("Got message of word back: " + response.data);
		const mess = JSON.parse(response.data);
		if (mess.message === "startGame") {
			setActivePlayer(mess.data.player);
			if (mess.data.player === playerName) {
				startRound(true, mess.data.rule);
			} else {
				startRound(false, mess.data.rule);
			}
		}
		if (mess.message === "getWord") {
			setGuessWord(mess.data);
		}
		if (mess.message === "generateWords") {
			socket.send(JSON.stringify({ message: "startGame", player: playerName })); //TODO generate a unique ID here or soemthing...
		}
		if (mess.message === "prevWords") {
			setPrevWords(mess.data);
		}
	};

	const startGame = () => {
		let categ = selectedCategory;
		if (selectedCategory === "Custom" && customCategory) {
			categ = customCategory;
		}
		const data = { category: categ };
		socket.send(JSON.stringify({ message: "generateWords", data: data })); //TODO generate a unique ID here or soemthing...
	};

	const startRound = (active: boolean, rule: string) => {
		setIsActivePlayer(active);
		setRule(rule);
		setScore(0);
		setGuessWord("");
		setPrevWords([]);
		clearTimeout(timeOut);
		setGameInProg(true);
		getNewWord();
		setTimes({
			time: 45,
			seconds: 45,
			minutes: 1,
		});
	};

	const getNewWord = () => {
		const data = { category: selectedCategory };
		socket.send(JSON.stringify({ message: "getWord", data: data }));
	};

	const wordRight = () => {
		const word: Word = { word: guessWord, guessState: "correct" };
		const newWords = [...prevWords];
		newWords.push(word);
		setPrevWords(newWords);
		console.log(
			"Sending Previous Words: " +
				JSON.stringify({ message: "prevWords", data: newWords }),
		);
		socket.send(JSON.stringify({ message: "prevWords", data: newWords }));
		getNewWord();
		const newScore: number = score + 1;
		setScore(newScore);
	};

	const wordPass = () => {
		const word: Word = { word: guessWord, guessState: "wrong" };
		const newWords = [...prevWords];
		newWords.push(word);
		setPrevWords(newWords);
		getNewWord();
		socket.send(JSON.stringify({ message: "prevWords", data: newWords }));
	};

	return (
		<>
			{!activePlayer && (
				<>
					<h1 className="flex justify-center text-lg font-bold">
						Welcome to Extreme Words
					</h1>
					<div className="flex flex-row justify-evenly pb-3">
						<div>Room: {gameId}</div>
						<div>Player: {playerName}</div>
					</div>
				</>
			)}
			{activePlayer && (
				<div className="flex justify-evenly py-3">
					<div>Time: {times.seconds}</div>
					<div>Score: {score}</div>
				</div>
			)}
			{activePlayer && (
				<Card className="transition-colors">
					<CardDescription className="flex max-w-lg justify-center p-3 leading-relaxed">
						<b>RULE:&nbsp;&nbsp;</b>
						{rule}
					</CardDescription>
				</Card>
			)}
			{guessWord && isActivePlayer && (
				<div className="flex justify-center pb-6 pt-3">
					<div className="text-grey-600 text-xl">{guessWord}</div>
				</div>
			)}
			{activePlayer && !isActivePlayer && (
				<div className="flex justify-center pb-6 pt-3">
					{activePlayer} is currently describing words!
				</div>
			)}
			{prevWords.map((word) => (
				<div className="flex justify-center" key={word.word}>
					<div
						className={
							word.guessState === "correct" ? "text-green-600" : "text-red-600"
						}
					>
						{word.word}
					</div>
				</div>
			))}
			{isActivePlayer && gameInProg === false && (
				<div className="flex justify-center pt-8">
					Well done, you got {score} points!
				</div>
			)}
			{gameInProg && isActivePlayer && (
				<div className="absolute inset-x-0 bottom-0 flex flex-row justify-evenly">
					<Button
						className="bg-yellow-500 hover:bg-yellow-500/90"
						onClick={wordPass}
					>
						<div className="flex items-center">Pass the Word</div>
					</Button>
					<Button
						className="bg-purple-500 hover:bg-purple-500/90"
						onClick={wordRight}
					>
						<div className="flex items-center">Got the Word!</div>
					</Button>
				</div>
			)}
			{!gameInProg && (
				<>
					{selectedCategory === "Custom" && (
						<form className="row flex justify-center">
							<input
								className=" focus:shadow-outline absolute bottom-14 w-80 appearance-none rounded border px-3 py-2 pb-4 leading-tight text-gray-700 shadow focus:outline-none"
								id="username"
								type="text"
								placeholder="eg. funny quotes, artists, adjectives"
								value={customCategory}
								onChange={(e) => setCustomCategory(e.target.value)}
							/>
						</form>
					)}
					<div className="absolute inset-x-0 bottom-0 flex justify-evenly">
						<Select
							defaultValue={selectedCategory}
							selectItems={categories}
							onChange={setSelectedCategory}
						/>
						<Button
							className="bg-green-500 px-8 hover:bg-green-500/90"
							onClick={() => startGame()}
						>
							<div className="flex items-center">Start Round</div>
						</Button>
					</div>
				</>
			)}
		</>
	);
}
