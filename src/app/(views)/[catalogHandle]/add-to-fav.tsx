"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/shadcn/button";

export const AddToFavorites = ({
  catalogId,
  catalogDescription,
  catalogTitle,
}: any) => {
  const [existingCatalogs, setExistingCatalogs] = useState<any[]>([]);

  useEffect(() => {
    setExistingCatalogs(
      JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
    );
  }, []);

  const [catalogExists, setCatalogExists] = useState<boolean>(false);

  useEffect(() => {
    checkIfExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCatalogs]);

  const checkIfExists = () => {
    for (let i = 0; i < existingCatalogs?.length; i++) {
      if (existingCatalogs[i].id === catalogId) {
        setCatalogExists(true);
        return;
      }
    }
    setCatalogExists(false);
  };

  const addToFav = () => {
    if (catalogExists) {
      // Remove the catalogId
      const filterCatalogIds = existingCatalogs.filter(
        (item: any) => item.id != catalogId
      );

      window?.localStorage?.setItem(
        "favorites",
        JSON.stringify(filterCatalogIds)
      );

      setExistingCatalogs(filterCatalogIds);
    }
    // Add the catalogId to favorites
    else {
      const favCatalog = {
        id: catalogId,
        title: catalogTitle,
        description: catalogDescription,
      };
      window?.localStorage?.setItem(
        "favorites",
        JSON.stringify([...existingCatalogs, favCatalog])
      );
      setExistingCatalogs((prev) => [...prev, favCatalog]);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={addToFav}
      aria-label={
        catalogExists
          ? "Remove catalog from favorites"
          : "Add catalog to favorites"
      }
    >
      <Star
        className={`h-4 w-4 ${
          catalogExists ? "fill-primary text-primary" : ""
        }`}
      />
    </Button>
  );
};
