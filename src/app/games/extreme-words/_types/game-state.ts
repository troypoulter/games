import { z } from "zod";

export const PlayerMarkSchema = z.enum(["X", "O"]);

export const BoardSchema = z.array(
	z.array(z.union([PlayerMarkSchema, z.null()])),
);

export const PlayerSchema = z.object({
	id: z.string(),
	name: z.string(),
	mark: PlayerMarkSchema,
});

export const GameStateSchema = z.object({
	hasGameStarted: z.boolean(),
	players: z.record(z.string(), PlayerSchema),
	board: BoardSchema,
	currentPlayer: PlayerSchema.nullable(),
	winner: PlayerSchema.nullable(),
	isDraw: z.boolean().nullable(),
});

export type GameState = z.infer<typeof GameStateSchema>;
