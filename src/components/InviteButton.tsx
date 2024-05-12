import { Check, Link } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";

export default function InviteButton() {
	const [buttonText, setButtonText] = useState(
		"Click here to copy the invite link!",
	);

	const handleCopy = () => {
		if (typeof window !== "undefined" && navigator.clipboard) {
			navigator.clipboard
				.writeText(window.location.href)
				.then(() => {
					setButtonText("Copied!");
					setTimeout(() => setButtonText("Invite"), 3000);
				})
				.catch((err) => console.error("Failed to copy URL: ", err));
		}
	};

	return (
		<Button size="sm" variant="outline" onClick={handleCopy}>
			{buttonText === "Copied!" ? (
				<Check size={22} className="mr-2" />
			) : (
				<Link size={22} className="mr-2" />
			)}
			{buttonText}
		</Button>
	);
}
