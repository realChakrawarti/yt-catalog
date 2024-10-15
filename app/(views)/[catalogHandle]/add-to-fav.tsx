"use client";

import { Button } from "@/app/components/Button";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

// TODO: Fix this component
export const AddToFavorites = () => {
  const pathname = usePathname();
  const catalogId = pathname.split("@")[1];


  const [existingCatalogs, setExistingCatalogs] = useState<string[]>(JSON.parse(
    window.localStorage.getItem("favorites") || "[]"
  ))


  const checkIfExists = () => {
    return existingCatalogs.includes(catalogId);
  };

  const addToFav = () => {
    if (checkIfExists()) {
      // Remove the catalogId
      const filterCatalogIds = existingCatalogs.filter(
        (item) => item != catalogId
      );

      window.localStorage.setItem(
        "favorites",
        JSON.stringify(filterCatalogIds)
      );
    }
    // Add the catalogId to favorites
    else {
      window.localStorage.setItem(
        "favorites",
        JSON.stringify([...existingCatalogs, catalogId])
      );
    }
  };

  return (
    <div>
      <Button variant="icon" onPress={addToFav}>
        {checkIfExists() ? (
          <MdFavorite size="16" />
        ) : (
          <MdFavoriteBorder size="16" />
        )}
      </Button>
    </div>
  );
};
