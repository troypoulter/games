import { Gamepad2 } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t bg-white py-6 shadow-sm md:py-0">
			<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<p className="flex flex-row text-center text-sm leading-loose text-muted-foreground md:text-left">
						<Gamepad2 size={28} color="#007DFC" className="mr-2" />
						<span>
							Built by Daniel, Michael and{" "}
							<a
								href="https://www.troypoulter.com/"
								target="_blank"
								rel="noreferrer"
								className="font-medium underline underline-offset-4"
							>
								troypoulter
							</a>
							.
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
