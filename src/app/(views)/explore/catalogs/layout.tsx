import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogs | YTCatalog",
};

export default function CatalogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
