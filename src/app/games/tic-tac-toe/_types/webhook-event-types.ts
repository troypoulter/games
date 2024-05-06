import { z } from "zod";

export const TicTacToeWebhookEvents = z.enum([
	"tictactoe.game.start",
	"tictactoe.game.restart",
	"tictactoe.game.full",
	"tictactoe.game.update",
	"tictactoe.move.made",
]);

export type TicTacToeWebhookEventsType = z.infer<typeof TicTacToeWebhookEvents>;
