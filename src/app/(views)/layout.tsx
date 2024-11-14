import "~/app/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import BackgroundPattern from "~/components/custom/background-pattern";
import Header from "~/components/custom/header.client";
import Footer from "~/components/custom/site-footer";
import { Toaster } from "~/components/shadcn/toaster";

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
        className={`min-h-full flex flex-col overflow-y-auto ${inter.className} container mx-auto`}
      >
        <BackgroundPattern />
        <Providers>
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
