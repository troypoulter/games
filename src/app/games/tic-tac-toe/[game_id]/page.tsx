import TicTacToeUI from "./_components/TicTacToeUI";

export default function GamePage({ params }: { params: { game_id: string } }) {
	const gameId = params.game_id;

	return (
		<div className="flex flex-row items-center justify-center gap-x-4">
			<TicTacToeUI gameId={gameId} connectionId="123" />
			<TicTacToeUI gameId={gameId} connectionId="321" />
		</div>
	);
}
