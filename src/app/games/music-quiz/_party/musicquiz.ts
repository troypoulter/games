/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type * as Party from "partykit/server";

const accessToken =
	"BQBXzdUsp4UruTjN7JDpRLihd3REFOiod9q7VHvh_-1L_0BZiRZUNpmrQRhwh9QPTThpjrZeEDwrT7y4FskCJKeNYR36SENTbH2Y-H4fhnKAiU4hSMA";

export default class MusicQuizServer implements Party.Server {
	constructor(readonly room: Party.Room) {}
	gameExists: boolean = false;
	gamePlayers: number = 0;

	// TODO DAN FOLLOW THIS BLOG
	// https://docs.partykit.io/guides/using-multiple-parties-per-project/#example-tracking-connections-across-rooms

	// eslint-disable-next-line @typescript-eslint/require-await
	async onStart() {
		console.log("Partykit server starting up");
	}

	// This Method Creates or returns the room
	async onRequest(req: Party.Request) {
		console.log("Got to OnRequest...");
		// TODO create or return room
		if (req.method === "POST") {
			const message: string = await req.json();
			console.log("Got to OnRequest. Message: " + JSON.stringify(message));
			this.gamePlayers++;
			if (this.gameExists) {
				console.log(
					`Game of Music Quiz exists, returning game! There are ${this.gamePlayers} players`,
				);
			} else {
				this.gameExists = true;
				console.log(
					`Game of Music Quiz does not exist, creating game! There are ${this.gamePlayers} players`,
				);
			}
		}

		if (this.gameExists) {
			return new Response("You got the party kit server!", {
				status: 200,
			});
		}
		console.log("You did a POST and didn't make it. Failing");
		return new Response("Not found", { status: 404 });
	}

	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		console.log("Got to message in Music Quiz");
		if (message === "getSong") {
			console.log("Got the getSong message in Music Quiz");
			await this.getSong();
		}
	}

	async getSong() {
		console.log("Getting song now!");
		const endpoint =
			"https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb";
		const headers = new Headers({
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		});

		await fetch(endpoint, { headers })
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error("Error:", error));
	}
}

MusicQuizServer satisfies Party.Worker;
