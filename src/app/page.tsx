import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";
import { Separator } from "@/components/ui/separator";

import GamesList from "./games/_components/games-list";

export default function Home() {
	return (
		<div>
			<PageHeader>
				<PageHeaderHeading>Games with Friends!</PageHeaderHeading>
				<PageHeaderDescription>
					Play a variety of fun games with friends on this free, online
					platform!
				</PageHeaderDescription>
				<PageActions></PageActions>
			</PageHeader>
			<Separator className="mx-auto -mt-4 mb-4 max-w-[980px]" />
			<GamesList />
		</div>
	);
}
