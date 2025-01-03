"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

import { Button } from "~/components/shadcn/button";
import { StarIcon } from "~/components/shared/icons";
import JustTip from "~/components/shared/just-the-tip";
import { toast } from "~/hooks/use-toast";
import { indexedDB } from "~/utils/dexie";

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
        id: catalogId,
        title: catalogTitle,
        description: catalogDescription,
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
