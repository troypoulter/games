import MusicQuizUI from "./_components/MusicQuizUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return <MusicQuizUI gameId={gameId} />;
}
