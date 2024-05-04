import { z } from "zod";

export const TicTacToeWebhookEvents = z.enum([
	"tictactoe.player.connected",
	"tictactoe.player.disconnected",
	"tictactoe.game.full",
	"tictactoe.game.started",
	"tictactoe.game.finished",
	"tictactoe.move.made",
]);

export type TicTacToeWebhookEventsType = z.infer<typeof TicTacToeWebhookEvents>;
