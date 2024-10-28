"use client";

import { Button } from "@/app/components/Button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

// TODO: Fix this component
export const AddToFavorites = ({
  catalogId,
  catalogDescription,
  catalogTitle,
}: any) => {
  const [existingCatalogs, setExistingCatalogs] = useState<any[]>(
    JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
  );

  const [catalogExists, setCatalogExists] = useState<boolean>(false);

  useEffect(() => {
    checkIfExists();
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
    <div className="absolute top-0 right-1/2">
      <Button variant="icon" onPress={addToFav}>
        {catalogExists ? (
          <MdFavorite size="16" />
        ) : (
          <MdFavoriteBorder size="16" />
        )}
      </Button>
    </div>
  );
};
