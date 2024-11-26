import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Archive | YTCatalog",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
