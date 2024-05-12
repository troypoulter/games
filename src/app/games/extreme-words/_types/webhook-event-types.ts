import { z } from "zod";

export const ExtremeWordsWebhookEvents = z.enum([
	"ExtremeWords.player.connected",
	"ExtremeWords.player.disconnected",
	"ExtremeWords.game.started",
	"ExtremeWords.move.made",
]);

export type ExtremeWordsWebhookEventsType = z.infer<
	typeof ExtremeWordsWebhookEvents
>;
