import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "../context/AuthContextProvider";
import Header from "../components/Header";
import { Toaster } from "../components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YTCatalog - Organize Your YouTube Universe",
  description:
    "Discover new channels, curate your favorite videos, and stay organized.",
  applicationName: "YTCat",
  keywords: ["YouTube", "catalog", "channels", "videos", "organize"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-full w-full overflow-y-auto flex flex-col ${inter.className} py-4 md:px-6`}
      >
        <AuthContextProvider>
          <Header />
          <main className="flex-grow">{children}</main>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
