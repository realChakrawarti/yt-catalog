"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import withAuth from "~/app/auth/with-auth-hoc";
import Spinner from "~/components/custom/Spinner";
import { useToast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import CatalogForm from "./catalog-form";
import ChannelTable from "./channel-table";

type CatalogPageParams = {
  catalogId: string;
};

type LocalChannel = {
  title: string;
  id: string;
};

function EditCatalog({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  const { toast } = useToast()

  const {
    data: catalogData,
    isLoading,
    error,
    mutate,
  } = useSWR(
    catalogId ? `/catalogs/${catalogId}` : null,
    (url) => fetchApi(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const [localChannel, setLocalChannel] = useState<LocalChannel[]>([]);
  const [savedChannels, setSavedChannels] = useState<any[]>([]);

  useEffect(() => {
    if (catalogData?.data) {
      setSavedChannels(catalogData?.data?.channelList);
    }
  }, [catalogData?.data]);

  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find((channel) => channel.id === id);
    if (deleteChannel) {
      alert(
        `Are you sure you want to remove ${deleteChannel.title}'s channel from the catalog?`
      );

      const payload = savedChannels.filter(
        (channel) => channel.id != deleteChannel.id
      );

      const result = await fetchApi(`/catalogs/${params.catalogId}/update`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast({title: `${deleteChannel.title}'s channel deleted from the catalog.`});
        mutate();
      } else {
        toast({title: "Something went wrong."});
      }
    }
  };

  const handleDeleteLocal = (id: string) => {
    const filteredChannels = localChannel.filter(
      (channel) => channel.id !== id
    );
    setLocalChannel(filteredChannels || []);
  };

  return (
    <div className="p-3">
      <h1 className="text-lg md:text-xl">Edit Catalog</h1>
      {error && <p>Something went wrong!</p>}
      {isLoading && (
        <div className="size-full grid items-center">
          <Spinner className="size-8" />
        </div>
      )}
      {!isLoading && !error && (
        <div>
          <div className="flex gap-2 items-center">
            {savedChannels?.length ? (
              <Link href={`/@${catalogId}`} target="_blank">
                Visit Catalog
              </Link>
            ) : null}
          </div>
          <CatalogForm
            setLocalChannel={setLocalChannel}
            revalidateCatalog={mutate}
            catalogId={catalogId}
            savedChannels={savedChannels}
            localChannel={localChannel}
            catalogData={catalogData?.data}
          />

          <div className="pt-5">
            <>
              <h2>Saved</h2>
              <ChannelTable
                channels={savedChannels}
                handleDelete={handleDeleteSaved}
              />
            </>
          </div>
          <div className="pt-5">
            {localChannel?.length ? (
              <>
                <h2>Not saved</h2>
                <ChannelTable
                  channels={localChannel}
                  handleDelete={handleDeleteLocal}
                />
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(EditCatalog);
