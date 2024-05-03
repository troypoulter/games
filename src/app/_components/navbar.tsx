import { Logo } from "./logo";
import { MobileSidebar } from "./mobile-sidebar";
import { SidebarRoutes } from "./sidebar-routes";

export const Navbar = () => {
	return (
		<div className="flex h-full border-b bg-white shadow-sm">
			<div className="container relative flex h-full items-center gap-x-4 p-4">
				<MobileSidebar />
				<div className="absolute left-1/2 -translate-x-1/2 transform md:static md:transform-none">
					<Logo />
				</div>
				<div className="inset-y-0 hidden h-full flex-col gap-x-4 md:flex">
					<SidebarRoutes />
				</div>
			</div>
		</div>
	);
};
