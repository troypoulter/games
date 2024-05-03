import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ScreenSizeIndicator from "@/components/screen-size-indicator";

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Games with Friends",
	description: "Play games with friends!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className="relative flex h-full min-h-screen flex-col bg-gradient-to-b from-white to-blue-100">
					<div className="fixed inset-y-0 z-[49] h-[64px] w-full">
						<Navbar />
					</div>
					<main className="container relative my-4 h-full flex-1 pt-[64px]">
						{children}
					</main>
					<Footer />
				</div>
				<ScreenSizeIndicator />
			</body>
		</html>
	);
}
