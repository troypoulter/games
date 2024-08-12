"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function CallBack() {
	useEffect(() => {
		const hashurl = window.location.hash || "";
		let token = window.localStorage.getItem("token");
		const room = localStorage.getItem("room") || undefined;

		if (!token) {
			if (hashurl) {
				token =
					hashurl
						.substring(1)
						.split("&")
						.find((elem: string) => elem.startsWith("access_token"))
						?.split("=")[1] || "failed";

				window.location.hash = "";
				window.localStorage.setItem("token", token);
			}
		}
		if (token && room) {
			localStorage.setItem("token", token);
			redirect(`/games/music-quiz/${room}`);
		}
	}, []);

	return (
		<div className="flex w-full items-center justify-center space-x-4 py-4">
			Welcome to the callback
		</div>
	);
}
