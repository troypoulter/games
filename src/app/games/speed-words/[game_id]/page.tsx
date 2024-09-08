import SpeedWordsUI from "./_components/SpeedWordsUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return <SpeedWordsUI gameId={gameId} />;
}
