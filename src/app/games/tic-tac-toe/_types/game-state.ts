import { z } from "zod";

export const PlayerSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const GameStateSchema = z.object({
	hasGameStarted: z.boolean(),
	players: z.record(z.string(), PlayerSchema),
});

export type GameState = z.infer<typeof GameStateSchema>;
