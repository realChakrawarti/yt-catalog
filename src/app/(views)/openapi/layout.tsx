import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenAPI | YTCatalog",
};

export default function OpenApiSpecification({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
