import ExtremeWordsUI from "./_components/ExtremeWordsUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return (
		<div>
			<ExtremeWordsUI gameId={gameId} />
		</div>
	);
}
