import { Gamepad2 } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t bg-white py-6 shadow-sm md:py-0">
			<div className="container flex flex-row justify-center md:h-24">
				<div className="flex flex-row items-center justify-center gap-2 px-0">
					<Gamepad2 size={28} color="#007DFC" className="mr-2" />
					<div className="flex flex-row justify-center text-xs">
						Built by Daniel, Michael and&nbsp;
						<a
							href="https://www.troypoulter.com/"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							troypoulter
						</a>
						.
					</div>
				</div>
			</div>
		</footer>
	);
}
