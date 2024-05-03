"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
	href: string;
	icon: LucideIcon;
	label: string;
	setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const SidebarItem = ({
	icon: Icon,
	label,
	href,
	setOpen,
}: SidebarItemProps) => {
	const pathname = usePathname();

	const isActive =
		(pathname === "/" && href === "/") ||
		pathname === href ||
		pathname?.startsWith(`${href}/`);

	const onClick = () => {
		if (setOpen) {
			setOpen(false);
		}
	};

	return (
		<Link
			onClick={onClick}
			href={href}
			className={cn(
				"flex items-center gap-x-2 rounded-lg pl-6 text-sm text-slate-500 transition-all hover:bg-muted md:p-4",
				isActive && "bg-muted font-medium text-primary",
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn(
						"text-slate-500",
						isActive && "font-medium text-primary",
					)}
				/>
				{label}
			</div>
		</Link>
	);
};
