import CreateGameRoomForm from "@/app/_components/CreateGameRoomForm";

export default function ExtremeWordsPage() {
	return (
		<div className="flex w-full items-center justify-center space-x-4 py-4">
			<CreateGameRoomForm game="extreme-words" />
		</div>
	);
}
