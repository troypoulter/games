import { z } from "zod";

// Grid is 3x3, so we represent the location with values 0-2 on both the row and col.
export const MoveDataSchema = z.object({
	row: z.number().min(0).max(2),
	col: z.number().min(0).max(2),
});

export type MoveData = z.infer<typeof MoveDataSchema>;
