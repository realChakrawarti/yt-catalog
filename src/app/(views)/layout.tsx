import "~/app/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "../../components/custom/Toast";
import Providers from "./context";
import Header from "~/components/custom/header";
import Footer from "~/components/custom/footer";
import BackgroundPattern from "~/components/custom/background-pattern";

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
        className={`min-h-full flex flex-col overflow-hidden ${inter.className} container mx-auto`}
      >
        <BackgroundPattern />
        <Providers>
          <Header />
          <main className="flex-1 p-3 overflow-y-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
      <Toaster />
    </html>
  );
}
