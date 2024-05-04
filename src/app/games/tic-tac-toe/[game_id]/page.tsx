import TicTacToeUI from "./_components/TicTacToeUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return (
		<div>
			<TicTacToeUI gameId={gameId} />
		</div>
	);
}
