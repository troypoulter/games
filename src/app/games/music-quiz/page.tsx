"use client";
import CreateGameRoomForm from "@/app/_components/CreateGameRoomForm";

export default function MusicQuizPage() {
	if (typeof window !== "undefined") {
		localStorage.setItem("token", "");
	}

	return (
		<div className="flex w-full items-center justify-center space-x-4 py-4">
			<CreateGameRoomForm game="music-quiz" />
		</div>
	);
}
