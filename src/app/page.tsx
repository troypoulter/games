import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";

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
		</div>
	);
}
