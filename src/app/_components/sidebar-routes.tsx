"use client";

import { Home, Play } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { SidebarItem } from "./sidebar-item";

const routes = [
	{
		icon: Home,
		label: "Home",
		href: "/",
	},
	{
		icon: Play,
		label: "Games",
		href: "/games",
	},
	// {
	// 	icon: LineChart,
	// 	label: "Analytics",
	// 	href: "/analytics",
	// },
];

interface SidebarRoutesProps {
	setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const SidebarRoutes = ({ setOpen }: SidebarRoutesProps) => {
	return (
		<div className="flex h-full w-full flex-col gap-y-2 p-3 pt-[56px] md:flex-row md:gap-x-2 md:gap-y-0 md:p-0 md:pt-0">
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
					setOpen={setOpen}
				/>
			))}
		</div>
	);
};
