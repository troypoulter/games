import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
	return (
		<Link href="/">
			<div className="flex flex-row items-center gap-x-1 transition-opacity hover:opacity-75">
				<Gamepad2 size={28} color="#007DFC" />
				<div className="text-lg font-semibold text-[#007DFC]">
					Games with Friends
				</div>
			</div>
		</Link>
	);
};
