import "~/app/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../../components/custom/Header";
import { Toaster } from "../../components/custom/Toast";
import Footer from "../../components/custom/Footer";
import Providers from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YTCatalog - Organize Your YouTube Universe",
  description:
    "Discover new channels, curate your favorite videos, and stay organized.",
  applicationName: "YTCatalog",
  keywords: ["youtube", "catalog", "channels", "videos", "organize"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body
        className={`min-h-full overflow-y-auto grid gap-3 grid-rows-[100px_1fr_50px] ${inter.className} p-3`}
      >
        <Providers>
          <Header />
          <main className="flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
      <Toaster />
    </html>
  );
}
