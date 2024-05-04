"use client";

import { Loader2, Play, X } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { createTicTacToeGame } from "../_actions/create-tictactoe-game";

function CreateGameButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			aria-disabled={pending}
			className={cn(
				"w-full bg-green-500 hover:bg-green-500/90",
				pending && "opacity-50",
			)}
		>
			{!pending && (
				<div className="flex items-center">
					<Play size={22} className="mr-2" /> Play with a friend
				</div>
			)}
			{pending && (
				<div className="flex items-center">
					<Loader2 size={22} className="mr-2 animate-spin" /> Creating game...
				</div>
			)}
		</Button>
	);
}

export default function CreateTicTacToeGameForm() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [state, formAction] = useFormState(createTicTacToeGame, {
		message: "",
	});

	return (
		<Card className="w-[560px]">
			<CardHeader className="items-center pb-0">
				<CardTitle>Create Tic Tac Toe Game</CardTitle>
			</CardHeader>
			<CardContent>
				{state?.message !== "" && !state.issues && (
					<div className="text-red-500">{state.message}</div>
				)}
				{state?.issues && (
					<div className="text-red-500">
						<ul>
							{state.issues.map((issue) => (
								<li key={issue} className="flex gap-1">
									<X fill="red" />
									{issue}
								</li>
							))}
						</ul>
					</div>
				)}
				<form className="space-y-4 pt-4" action={formAction}>
					<CreateGameButton />
				</form>
			</CardContent>
		</Card>
	);
}
