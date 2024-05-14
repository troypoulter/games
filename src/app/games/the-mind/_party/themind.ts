/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type * as Party from "partykit/server";

export default class ExtremeWordsServer implements Party.Server {
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
					`Game exists, returning game! There are ${this.gamePlayers} players`,
				);
			} else {
				this.gameExists = true;
				console.log(
					`Game does not exist, creating game! There are ${this.gamePlayers} players`,
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

	// eslint-disable-next-line @typescript-eslint/require-await
	async onMessage(request: string) {
		const requestJson = JSON.parse(request);
		const message = requestJson.message;
		// const fred = Party.getConnections();
		// console.log(`Connections: ` + JSON.stringify(fred));
		if (message === "deal") {
			const response = { message: "deal", data: [1, 2, 3] };
			console.log(`There are ${JSON.stringify(this.room)} active connections`);
			this.room.broadcast(JSON.stringify(response));
		} else if (message === "getWord") {
			console.log("Generating");
		} else {
			console.log("Message is not getWord");
		}
	}
}

ExtremeWordsServer satisfies Party.Worker;
