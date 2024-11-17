"use client";

import withAuth from "~/app/auth/with-auth-hoc";

import CatalogEditor from "./catalog-editor";

type CatalogPageParams = {
  catalogId: string;
};

function EditCatalog({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  return (
    <div className="p-3">
      <CatalogEditor catalogId={catalogId} />
    </div>
  );
}

export default withAuth(EditCatalog);
