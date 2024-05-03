"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { SidebarRoutes } from "./sidebar-routes";

export const MobileSidebar = () => {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
				<Menu />
			</SheetTrigger>
			<SheetContent side="left" className="bg-white p-0">
				<SidebarRoutes setOpen={setOpen} />
			</SheetContent>
		</Sheet>
	);
};
