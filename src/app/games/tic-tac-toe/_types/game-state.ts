import { z } from "zod";

export const PlayerMarkSchema = z.enum(["X", "O"]);
export type PlayerMarkType = z.infer<typeof PlayerMarkSchema>;

export const BoardSchema = z.array(
	z.array(z.union([PlayerMarkSchema, z.null()])),
);
export type BoardType = z.infer<typeof BoardSchema>;

export const PlayerSchema = z.object({
	id: z.string(),
	name: z.string(),
	mark: PlayerMarkSchema,
});

export const GameStateSchema = z.object({
	players: z.record(z.string(), PlayerSchema),
	board: BoardSchema,
	currentPlayer: PlayerSchema.nullable(),
	winner: PlayerSchema.nullable(),
	isDraw: z.boolean().nullable(),
});

export type GameState = z.infer<typeof GameStateSchema>;
