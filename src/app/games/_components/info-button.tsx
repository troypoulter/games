"use client";
import { Info } from "lucide-react";
import { useState } from "react";

import { getRules } from "@/lib/rules";

import RulesModal from "./rules-modal";

interface InfoButtonProps {
	game: string;
}

export default function InfoButton({ game }: InfoButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showInfo = () => {
		console.log("Clicked Info button");
		setIsModalOpen(true);
	};

	return (
		<div>
			<button
				className="flex items-center justify-center rounded-full bg-blue-400 p-2 text-white hover:bg-blue-600"
				onClick={showInfo}
			>
				<Info />
			</button>
			{isModalOpen && (
				<RulesModal
					game={game}
					onClose={() => setIsModalOpen(false)}
					rules={getRules(game)}
				/>
			)}
		</div>
	);
}
