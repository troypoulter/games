"use client";

// import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

import { Button } from "@/components/ui/button";
// import { PARTYKIT_HOST } from "@/lib/env";

export default function MusicQuizUI({ gameId }: { gameId: string }) {
	const room = gameId;
	console.log("NEW Music quiz room is: " + room);
	const CLIENT_ID = "8b0c0a8afa3f497497fc9955bf27f527";
	const REDIRECT_URI = "http://localhost:3000/games/music-quiz/callback";
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "token";
	const scope =
		"streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify";

	const [showSong, setShowSong] = useState<boolean>(false);
	const [token, setToken] = useState<string | undefined>(undefined);

	useEffect(() => {
		const token = localStorage.getItem("token") || undefined;
		setToken(token);
	}, []);

	const getSong = () => {
		setShowSong(!showSong);
	};
	localStorage.setItem("room", room);
	const storageRoom = localStorage.getItem("room");
	console.log("Storage is: " + storageRoom);

	return (
		<div>
			<div>Welcome to the Music Quiz game!</div>
			{!token && (
				<a
					href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`}
				>
					<Button>Login to Spotify</Button>
				</a>
			)}
			{token && <div>Successfully logged in</div>}
			<br />
			<Button onClick={getSong}>Get Song!</Button>
			{showSong && token && (
				<SpotifyPlayer
					token={token}
					uris={["spotify:artist:3zxKH0qp3nBCuPZCZT5Vaf"]}
				/>
			)}
		</div>
	);
}
