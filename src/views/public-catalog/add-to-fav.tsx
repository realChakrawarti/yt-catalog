"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { toast } from "~/shared/hooks/use-toast";
import { indexedDB } from "~/shared/lib/api/dexie";
import { Button } from "~/shared/ui/button";
import JustTip from "~/widgets/just-the-tip";

export const AddToFavorites = ({
  catalogId,
  catalogTitle,
  catalogDescription,
}: any) => {
  const favoriteCatalogs =
    useLiveQuery(() => indexedDB["favorites"].toArray(), []) ?? [];
  const [catalogExists, setCatalogExists] = useState<boolean>(false);

  useEffect(() => {
    checkIfExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteCatalogs]);

  const checkIfExists = () => {
    for (let i = 0; i < favoriteCatalogs?.length; i++) {
      if (favoriteCatalogs[i].id === catalogId) {
        setCatalogExists(true);
        return;
      }
    }
    setCatalogExists(false);
  };

  const addToFav = async () => {
    if (catalogExists) {
      toast({ title: "Catalog removed from favorites." });

      await indexedDB["favorites"].delete(catalogId);
    }
    // Add the catalogId to favorites
    else {
      const favCatalog = {
        description: catalogDescription,
        id: catalogId,
        title: catalogTitle,
      };
      await indexedDB["favorites"].add(favCatalog);
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
        <StarIcon
          className={`h-4 w-4 ${
            catalogExists ? "fill-primary text-primary" : ""
          }`}
        />
      </Button>
    </JustTip>
  );
};
