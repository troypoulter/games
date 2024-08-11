import React from "react";

import { Button } from "@/components/ui/button";

interface RulesModalProps {
	game: string;
	onClose: () => void;
	rules: string;
}

export default function RulesModal({ onClose, game, rules }: RulesModalProps) {
	return (
		<div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50">
			<div className="w-96 rounded-md border bg-white p-8 shadow-lg">
				<div className="text-center">
					<h3 className="text-2xl font-bold text-gray-900">Rules: {game}</h3>
					<div className="mt-2 px-7 py-3">
						<p className="text-lg text-gray-500">{rules}</p>
					</div>
					<Button
						className="bg-blue-500 px-4 hover:bg-blue-500/90"
						onClick={onClose}
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}
