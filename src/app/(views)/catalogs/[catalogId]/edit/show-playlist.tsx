import Fuse from "fuse.js";
import { ChevronsUpDown, Link } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/shadcn/collapsible";
import { Input } from "~/components/shadcn/input";
import fetchApi from "~/utils/fetch";

export default function ShowPlaylist({
  channelPlaylists,
  catalogId,
}: {
  channelPlaylists: any[];
  catalogId: string;
}) {
  const [searchPlaylists, setSearchPlaylists] = useState<any[]>([]);
  const [playlistInput, setPlaylistInput] = useState<string>("");

  const [localPlaylists, setLocalPlaylist] = useState<any[]>([]);

  const [fuse, setFuse] = useState<Fuse<any[]> | null>(null);

  useEffect(() => {
    if (channelPlaylists) {
      const fuseInstance = new Fuse(channelPlaylists, {
        keys: ["snippet.title", "snippet.description"],
        threshold: 0.4,
      });
      setFuse(fuseInstance);
    }
  }, [channelPlaylists]);

  const handleLocalPlaylist = (playlist: any) => {
    const playlistItem = {
      title: playlist.snippet.title,
      thumbnail: playlist.snippet.thumbnails.medium.url,
      id: playlist.id,
      channelId: playlist.snippet.channelId,
      channelTitle: playlist.snippet.channelTitle,
      publishedAt: playlist.snippet.publishedAt,
      description: playlist.snippet.description,
    };

    // Check if playlist already added

    const playlistExists = localPlaylists.find(
      (item) => item.id === playlistItem.id
    );

    // Remove playlist when already added
    if (playlistExists) {
      const filteredPlaylist = localPlaylists.filter(
        (item) => item.id !== playlistItem.id
      );
      setLocalPlaylist(filteredPlaylist);
      // Add playlist to the local playlist
    } else {
      setLocalPlaylist((prev) => [...prev, playlistItem]);
    }
  };

  function fuzzySearchPlaylist(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setPlaylistInput(value);
    const search = fuse?.search(value);

    if (search?.length) {
      setSearchPlaylists(search.map((item: any) => item.item));
    } else {
      setSearchPlaylists([]);
    }
  }

  function playlistInLocal(id: string) {
    return Boolean(localPlaylists.find((item) => item.id === id));
  }

  return (
    <>
      {channelPlaylists.length ? (
        <Input
          placeholder="Search playlist"
          value={playlistInput}
          onChange={fuzzySearchPlaylist}
        />
      ) : null}

      <SearchPlaylistFound
        catalogId={catalogId}
        localPlaylists={localPlaylists}
        channelPlaylists={channelPlaylists}
        searchPlaylists={searchPlaylists}
        handleLocalPlaylist={handleLocalPlaylist}
        playlistInLocal={playlistInLocal}
      />
    </>
  );
}

function SearchPlaylistFound({
  channelPlaylists,
  searchPlaylists,
  handleLocalPlaylist,
  playlistInLocal,
  localPlaylists,
  catalogId,
}: any) {
  // No search has taken place
  if (channelPlaylists.length && !searchPlaylists.length) {
    return (
      <>
        <RenderList
          list={channelPlaylists}
          handleLocalPlaylist={handleLocalPlaylist}
          playlistInLocal={playlistInLocal}
        />
        <RenderLocalList
          localPlaylists={localPlaylists}
          catalogId={catalogId}
        />
      </>
    );
  }

  // After the search
  if (searchPlaylists.length) {
    return (
      <>
        <RenderList
          list={searchPlaylists}
          handleLocalPlaylist={handleLocalPlaylist}
          playlistInLocal={playlistInLocal}
        />
        <RenderLocalList
          localPlaylists={localPlaylists}
          catalogId={catalogId}
        />
      </>
    );
  }
}

function RenderLocalList({
  localPlaylists,
  catalogId,
}: {
  localPlaylists: any[];
  catalogId: string;
}) {
  const handleAddPlaylistsToCatalog = async () => {
    // TODO: Add channelLogo part of payload
    const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
      method: "PATCH",
      body: JSON.stringify(localPlaylists),
    });

    console.log(">>>Result", result);
  };

  if (localPlaylists.length) {
    return (
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2>Selected {localPlaylists.length} playlists</h2>
          <Button onClick={handleAddPlaylistsToCatalog}>Add to catalog</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {localPlaylists.map((item: any) => {
            return <LocalList key={item.id} item={item} />;
          })}
        </div>
      </section>
    );
  }
  return null;
}

function LocalList({ item }: { item: any }) {
  return (
    <section className="flex gap-2 items-center justify-between bg-card p-2 rounded-md">
      {item?.description ? (
        <abbr
          className="cursor-help underline-offset-1 self-start"
          title={item?.description}
        >
          <h3 className="text-xs">{item?.title}</h3>
        </abbr>
      ) : (
        <h3 className="text-xs self-start">{item?.title}</h3>
      )}

      <div className="flex gap-2 items-center self-start">
        <a
          target="_blank"
          href={`https://www.youtube.com/playlist?list=${item?.id}`}
        >
          <Link className="size-3" />
        </a>
      </div>
    </section>
  );
}

function RenderList({ list, handleLocalPlaylist, playlistInLocal }: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section className="space-y-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="flex items-center justify-between">
          <p>Found {list.length} playlists</p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map((item: any) => {
              return (
                <PlaylistCard
                  key={item.id}
                  item={item}
                  handleLocalPlaylist={handleLocalPlaylist}
                  playlistInLocal={playlistInLocal}
                />
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}

function PlaylistCard({ item, handleLocalPlaylist, playlistInLocal }: any) {
  return (
    <section
      onClick={() => handleLocalPlaylist(item)}
      className={`flex gap-2 items-center justify-between bg-card p-2 rounded-md cursor-pointer ${
        playlistInLocal(item.id) ? "outline outline-1 outline-primary" : null
      }`}
    >
      {item?.snippet?.description ? (
        <abbr
          className="cursor-help underline-offset-1 self-start"
          title={item?.snippet?.description}
        >
          <h3 className="text-xs">{item?.snippet?.title}</h3>
        </abbr>
      ) : (
        <h3 className="text-xs self-start">{item?.snippet?.title}</h3>
      )}

      <div className="flex gap-2 items-center self-start">
        <a
          target="_blank"
          href={`https://www.youtube.com/playlist?list=${item?.id}`}
        >
          <Link className="size-3" />
        </a>
      </div>
    </section>
  );
}
