import CreateGameRoomForm from "@/app/_components/CreateGameRoomForm";

export default function TheMindPage() {
	return (
		<div className="flex w-full items-center justify-center space-x-4 py-4">
			<CreateGameRoomForm game="the-mind" />
		</div>
	);
}
