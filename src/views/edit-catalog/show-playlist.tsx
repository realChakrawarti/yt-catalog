import Fuse from "fuse.js";
import { ChevronsUpDown, Link } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "~/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/ui/collapsible";
import { Input } from "~/shared/ui/input";
import { OutLink } from "~/widgets/out-link";

import useCatalogStore from "./catalog-store";

export default function ShowPlaylist() {
  const {
    setSearchPlaylists,
    channelPlaylists,
    playlistInput,
    setPlaylistInput,
  } = useCatalogStore();

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

  return (
    <>
      {channelPlaylists.length ? (
        <Input
          placeholder="Search playlist"
          value={playlistInput}
          onChange={fuzzySearchPlaylist}
        />
      ) : null}

      <SearchPlaylistFound />
    </>
  );
}

function SearchPlaylistFound() {
  const { searchPlaylists, channelPlaylists } = useCatalogStore();

  // No search has taken place
  if (channelPlaylists.length && !searchPlaylists.length) {
    return (
      <>
        <RenderList list={channelPlaylists} />
        <RenderLocalList />
      </>
    );
  }

  // After the search
  if (searchPlaylists.length) {
    return (
      <>
        <RenderList list={searchPlaylists} />
        <RenderLocalList />
      </>
    );
  }
}

function RenderLocalList() {
  const { localPlaylists } = useCatalogStore();

  if (localPlaylists.length) {
    return (
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2>Selected {localPlaylists.length} playlists</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {localPlaylists.map((item) => {
            return (
              <section
                key={item.id}
                className="flex gap-2 items-center justify-between bg-card p-2 rounded-md"
              >
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
                  <OutLink
                    href={`https://www.youtube.com/playlist?list=${item?.id}`}
                  >
                    <Link className="size-3" />
                  </OutLink>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    );
  }
  return null;
}

function RenderList({ list }: any) {
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
              return <PlaylistCard key={item.id} item={item} />;
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}

function PlaylistCard({ item }: any) {
  const { localPlaylists, setLocalPlaylists } = useCatalogStore();

  function playlistInLocal(id: string) {
    return Boolean(localPlaylists.find((item) => item.id === id));
  }

  const handleLocalPlaylist = (playlist: any) => {
    const playlistItem = {
      channelId: playlist.snippet.channelId,
      channelTitle: playlist.snippet.channelTitle,
      description: playlist.snippet.description,
      id: playlist.id,
      publishedAt: playlist.snippet.publishedAt,
      thumbnail: playlist.snippet.thumbnails.medium.url,
      title: playlist.snippet.title,
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
      setLocalPlaylists(filteredPlaylist);
      // Add playlist to the local playlist
    } else {
      setLocalPlaylists([...localPlaylists, playlistItem]);
    }
  };

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
        <OutLink href={`https://www.youtube.com/playlist?list=${item?.id}`}>
          <Link className="size-3" />
        </OutLink>
      </div>
    </section>
  );
}
