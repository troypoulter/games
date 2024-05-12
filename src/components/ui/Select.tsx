/* eslint-disable @typescript-eslint/no-unsafe-return */

import React from "react";

// interface DropDownItem {
// 	label: string;
// 	value: string;
// }

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
		<div className="absolute inset-x-0 bottom-0 flex justify-center">
			<form className="mx-auto max-w-sm">
				<label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					Select an option
				</label>
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
