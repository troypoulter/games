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
	sendPeel,
	color,
	handleBackSpace,
}: any) => {
	const kl = [...letters];
	const keyRows = [];
	while (kl.length >= 10) {
		const row = kl.splice(0, 9);
		keyRows.push(row);
	}
	keyRows.push(kl);

	const handleDirectionPress = () => {
		setAutoDirect(autoDirect === "→" ? "↓" : "→");
	};

	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
			<div className="flex-col">
				{keyRows.map((kr, idx) => (
					<KeyboardRow
						key={idx}
						rowLetters={kr}
						onKeyPress={onKeyPress}
						color={color}
					/>
				))}
				<div className="mb-10 flex items-center justify-center">
					<div>Direction: </div>
					<div onClick={() => handleDirectionPress()}>
						<div className="my-2 ml-1 mr-5 rounded-md bg-blue-500 p-3">
							<div className="text-sm font-medium"> {autoDirect} </div>
						</div>
					</div>
					<div onClick={() => handleBackSpace()}>
						<div className="mx-5 my-2 rounded-md bg-blue-500 p-3">
							<div className="text-sm font-medium">⌫</div>
						</div>
					</div>
					<div onClick={() => sendPeel()}>
						<div className="mx-5 my-2 rounded-md bg-blue-500 p-3">
							<div className="text-sm font-medium">PEEL</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const KeyboardRow = ({ onKeyPress, rowLetters, color }: any) => (
	<div className="mb-2 flex justify-center">
		{rowLetters.map((letter: any, idx: any) => (
			<div key={idx} onClick={() => onKeyPress(letter, idx)}>
				<div className={`m-0.5 rounded-md ${color} p-3`}>
					<div className="px-1 text-sm font-medium">{letter}</div>
				</div>
			</div>
		))}
	</div>
);
