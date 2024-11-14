import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | YTCatalog",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
