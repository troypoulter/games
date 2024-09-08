/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const Keyboard = ({
	letters,
	onKeyPress,
	autoDirect,
	setAutoDirect,
}: any) => {
	const kl = [...letters];
	const keyRows = [];
	while (kl.length > 10) {
		const row = kl.splice(0, 9);
		keyRows.push(row);
	}
	keyRows.push(kl);

	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
			<div className="flex-col">
				<DirectionRow autoDirect={autoDirect} setAutoDirect={setAutoDirect} />
				{keyRows.map((kr, idx) => (
					<KeyboardRow key={idx} rowLetters={kr} onKeyPress={onKeyPress} />
				))}
				<div className="mb-10 flex justify-center">
					<div onClick={() => onKeyPress("PEEL")}>
						<div className="mx-5 my-2 rounded-md bg-gray-200 p-3">
							<div className="text-sm font-medium">PEEL</div>
						</div>
					</div>
					<div onClick={() => onKeyPress("⌫")}>
						<div className="mx-5 my-2 rounded-md bg-gray-200 p-3">
							<div className="text-sm font-medium">⌫</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const KeyboardRow = ({ onKeyPress, rowLetters }: any) => (
	<div className="mb-2 flex justify-center">
		{rowLetters.map((letter: any, idx: any) => (
			<div key={idx} onClick={() => onKeyPress(letter, idx)}>
				<div className="m-1 rounded-md bg-gray-200 p-3">
					<div className="text-xs font-medium">{letter}</div>
				</div>
			</div>
		))}
	</div>
);

export const DirectionRow = ({ autoDirect, setAutoDirect }: any) => {
	const handleDirectionPress = () => {
		setAutoDirect(autoDirect === "→" ? "↓" : "→");
	};

	return (
		<div className="flex flex-row items-center justify-center">
			<div>Direction: </div>
			<div onClick={() => handleDirectionPress()}>
				<div className="m-1 ml-3 rounded-md bg-gray-200 p-3">
					<div className="text-xs font-medium"> {autoDirect} </div>
				</div>
			</div>
		</div>
	);
};
