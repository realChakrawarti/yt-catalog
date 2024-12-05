"use client";

import { Star } from "~/components/custom/icons";
import { useEffect, useState } from "react";

import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
import { toast } from "~/hooks/use-toast";

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

      toast({ title: "Catalog removed from favorites." });

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
      toast({ title: "Catalog added to favorites." });
    }
  };

  return (
    <JustTip
      label={catalogExists ? "Remove from favorites" : "Add to favorites"}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={addToFav}
        aria-label={
          catalogExists ? "Remove from favorites" : "Add to favorites"
        }
      >
        <Star
          className={`h-4 w-4 ${
            catalogExists ? "fill-primary text-primary" : ""
          }`}
        />
      </Button>
    </JustTip>
  );
};
