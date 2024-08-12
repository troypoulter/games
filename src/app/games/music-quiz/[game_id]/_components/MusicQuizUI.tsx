"use client";

// import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

import { Button } from "@/components/ui/button";
// import { PARTYKIT_HOST } from "@/lib/env";

export default function MusicQuizUI({ gameId }: { gameId: string }) {
	const room = gameId;
	const [callbackUri, setCallbackUri] = useState<string | undefined>(undefined);
	console.log("NEW Music quiz room is: " + room);
	const CLIENT_ID = "8b0c0a8afa3f497497fc9955bf27f527";
	const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
	const RESPONSE_TYPE = "token";
	const scope =
		"streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify";

	const [showSong, setShowSong] = useState<boolean>(false);
	const [token, setToken] = useState<string | undefined>(undefined);

	useEffect(() => {
		const token = localStorage.getItem("token") || undefined;
		setToken(token);
		const REDIRECT_URI =
			window.location.protocol +
			"//" +
			location.host +
			"/games/music-quiz/callback"; // TODO CHANGE THIS TO THE URL
		setCallbackUri(REDIRECT_URI);
		console.log(REDIRECT_URI);
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
					href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${callbackUri}&response_type=${RESPONSE_TYPE}&scope=${scope}`}
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
