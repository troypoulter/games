// This attempts to follow the Standard Webhook spec outlined here.
// https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md

import { z } from "zod";

import { TicTacToeWebhookEvents } from "@/app/games/tic-tac-toe/_types/webhook-event-types";

const AllGameWebhookEvents = [...TicTacToeWebhookEvents.options] as const;
export const WebhookEventType = z.enum(AllGameWebhookEvents);
export type WebhookEventTypeType = z.infer<typeof WebhookEventType>;

export const StandardWebhookMessageSchema = <T extends z.ZodTypeAny>(
	dataSchema: T | undefined,
) =>
	z.object({
		type: WebhookEventType,
		// timestamp: z.date(),
		data: dataSchema ? dataSchema.optional() : z.undefined(),
	});

export function createStandardWebhookMessage<T extends z.ZodTypeAny>(
	type: WebhookEventTypeType,
	data: z.infer<T> | undefined,
	dataSchema: T | undefined,
): string {
	const MessageSchema = StandardWebhookMessageSchema(dataSchema);
	const message = MessageSchema.parse({
		type: type,
		// timestamp: new Date(),
		data: data,
	});

	return JSON.stringify(message);
}

export function parseStandardWebhookMessage<T extends z.ZodTypeAny>(
	jsonString: string,
	dataSchema: T | undefined,
) {
	const MessageSchema = StandardWebhookMessageSchema(dataSchema);
	const result = MessageSchema.safeParse(JSON.parse(jsonString));

	if (result.success) {
		return result.data;
	} else {
		console.error("Failed to parse webhook message:", result.error.flatten());
		return result.error;
	}
}
