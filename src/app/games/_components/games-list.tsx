import Link from "next/link";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const games = [
	{
		label: "Tic Tac Toe",
		description: "Play Tic Tac Toe with friends or against a robot!",
		href: "/games/tic-tac-toe",
	},
	{
		label: "Extreme Words",
		description: "Play Extreme Words with a group of friends!",
		href: "/games/extreme-words",
	},
	{
		label: "The Mind",
		description:
			"Play numbers in ascending order as a team... it's all about the vibe!",
		href: "/games/the-mind",
	},
];

export default function GamesList() {
	return (
		<div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{games.map((game) => (
				<Link href={game.href} key={game.href} passHref>
					<Card className="transition-colors duration-300 hover:scale-105 hover:animate-hover-tada hover:bg-blue-100 sm:col-span-2">
						<CardHeader className="pb-3">
							<CardTitle>{game.label}</CardTitle>
							<CardDescription className="max-w-lg text-balance leading-relaxed">
								{game.description}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	);
}
