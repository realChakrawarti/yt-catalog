import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | YTCatalog",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
