import dynamic from "next/dynamic";

const OpenApiSpecification = dynamic(() => import("~/views/open-api-spec"), {
  ssr: false,
});

export default function OpenAPIPage() {
  return <OpenApiSpecification />;
}
