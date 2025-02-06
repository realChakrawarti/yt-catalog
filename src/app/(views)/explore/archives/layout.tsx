import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archives | YTCatalog",
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
