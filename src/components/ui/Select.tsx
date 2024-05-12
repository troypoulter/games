/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from "react";

interface SelectProps {
	defaultValue: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	onChange: Function;
	selectItems: string[];
}

export default function Select({
	defaultValue,
	selectItems,
	onChange,
}: SelectProps) {
	return (
		<div className="flex justify-center">
			<form className="mx-auto max-w-sm">
				<select
					className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					onChange={(e) => onChange(e.target.value)}
					defaultValue={defaultValue}
				>
					{selectItems.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
			</form>
		</div>
	);
}
