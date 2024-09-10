/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const getCellLetter = (
	rowNum: any,
	colNum: any,
	letterGrid: { [x: string]: { [x: string]: any } },
): string => {
	if (letterGrid[rowNum] != null) {
		if (letterGrid[rowNum][colNum] != null) {
			return letterGrid[rowNum][colNum];
		}
	}
	return "";
};

const Cell = (props: { isSelected: any; letter: any }) => (
	<div
		className={`border-1 flex h-8 w-8 items-center justify-center border 
			${props.isSelected ? "border-2 border-red-300" : "border-grey-300"}`}
	>
		{props.letter != "" && (
			<div className="text-m flex h-8 w-8 items-center justify-center rounded-sm bg-purple-400 font-bold">
				{props.letter}
			</div>
		)}
	</div>
);
const Row = (props: {
	changeCell: any;
	letterGrid: any;
	rowNum: any;
	selectedCell: any;
}) => {
	const cells = [];
	for (let colNum = 0; colNum < 30; colNum++) {
		let isSelected = false;
		if (
			props.selectedCell[0] == props.rowNum &&
			props.selectedCell[1] == colNum
		) {
			isSelected = true;
		}
		cells.push(
			<div key={colNum} onClick={() => props.changeCell(props.rowNum, colNum)}>
				<Cell
					letter={getCellLetter(props.rowNum, colNum, props.letterGrid)}
					isSelected={isSelected}
				/>
			</div>,
		);
	}
	return <div className="flex flex-row items-center">{cells}</div>;
};
export const getRows = (
	letterGrid: any,
	selectedCell: any,
	changeCell: any,
) => {
	const rows = [];
	for (let i = 0; i < 30; i++) {
		rows.push(
			<Row
				key={i}
				letterGrid={letterGrid}
				rowNum={i}
				selectedCell={selectedCell}
				changeCell={changeCell}
			/>,
		);
	}
	return rows;
};

export default function SpeedWordsBoard({
	letterGrid,
	selectedCell,
	changeCell,
}: {
	changeCell: any;
	letterGrid: any;
	selectedCell: any;
}) {
	return (
		<div className="mt-30 mb-100 ml-0">
			{getRows(letterGrid, selectedCell, changeCell)}
		</div>
	);
}
