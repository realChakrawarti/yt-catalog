import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog | YTCatalog",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
