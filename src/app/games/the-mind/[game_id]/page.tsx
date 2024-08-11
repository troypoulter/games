import TheMindUI from "./_components/TheMindUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return <TheMindUI gameId={gameId} />;
}
