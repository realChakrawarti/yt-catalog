import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch later | YTCatalog",
};

export default function WatchLaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
