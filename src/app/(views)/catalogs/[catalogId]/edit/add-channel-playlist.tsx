import { ListPlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/shadcn/button";
import { Input } from "~/components/shadcn/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import ShowPlaylist from "./show-playlist";

type VideoLink = {
  link: string;
  error: string;
};

const YouTubeVideoLinkRegex =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

export default function AddChannelPlaylist({
  localChannel,
  savedChannels,
  setLocalChannel,
  catalogId,
}: any) {
  const [videoLink, setVideoLink] = useState<VideoLink>({
    link: "",
    error: "",
  });

  const [channelInfo, setChannelInfo] = useState<{ title: string; id: string }>(
    {
      title: "",
      id: "",
    }
  );

  const [fetchedChannelPlaylists, setFetchedChannelPlaylists] =
    useState<boolean>(false);

  const [channelPlaylists, setChannelPlaylists] = useState<any[]>([]);

  const handleVideoLink = (e: any) => {
    setVideoLink((prev) => ({
      ...prev,
      link: e.target.value,
    }));

    if (!YouTubeVideoLinkRegex.test(e.target.value)) {
      setVideoLink((prev) => ({
        ...prev,
        error: "Invalid YouTube video link.",
      }));

      return;
    } else {
      setVideoLink((prev) => ({
        ...prev,
        error: "",
      }));
    }
  };

  const validateVideoLink = async () => {
    const found = videoLink.link.match(YouTubeVideoLinkRegex);
    let videoId = "";
    if (found?.length) {
      videoId = found[1];
    }

    if (videoId) {
      const result = await fetchApi(`/youtube/get-video?videoId=${videoId}`);

      if (!result.success) {
        toast({ title: result.message });
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      setChannelInfo({
        id: channelId,
        title: channelTitle,
      });
    }
  };

  const addChannelToLocal = () => {
    const alreadyExists = localChannel.find(
      (item: any) => item.id === channelInfo.id
    );

    const alreadySaved = savedChannels?.find(
      (channel: any) => channel.id === channelInfo.id
    );

    if (!alreadyExists && !alreadySaved) {
      setLocalChannel((prev: any) => [
        ...prev,
        { id: channelInfo.id, title: channelInfo.title },
      ]);
      setChannelInfo({ title: "", id: "" });
      toast({ title: `${channelInfo.title}'s channel added to the list.` });
    } else if (alreadyExists) {
      toast({
        title: `${channelInfo.title}'s channel already added to the list.`,
      });
      setChannelInfo({ title: "", id: "" });
    } else if (alreadySaved) {
      toast({ title: `${channelInfo.title}'s channel already saved.` });
    }

    setVideoLink({
      link: "",
      error: "",
    });
  };

  const fetchChannelPlaylists = async () => {
    const result = await fetchApi(
      `/youtube/get-playlists?channelId=${channelInfo.id}`
    );

    if (!result.success) {
      toast({ title: result.message });
      return;
    }

    const playlists = result.data;

    if (!playlists.length) {
      toast({ title: `No playlist created by ${channelInfo.title}` });
      setFetchedChannelPlaylists(true);
      return;
    }

    setFetchedChannelPlaylists(true);
    setChannelPlaylists(playlists);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <div className="flex gap-2 items-center">
              <ListPlusIcon className="size-8" />
              <p>Add channel from video</p>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto w-full md:max-w-[450px] space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Paste YouTube video link</SheetTitle>
            <SheetDescription className="sr-only">
              Paste YouTube video link
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                className="search-me-daddy"
                type="search"
                placeholder="Enter video URL"
                value={videoLink.link}
                onChange={handleVideoLink}
              />
              {/* TODO: Maybe paste from clipboard icon and validate */}
              <Button
                disabled={Boolean(videoLink.error || !videoLink.link)}
                onClick={validateVideoLink}
              >
                Validate
              </Button>
            </div>
            {videoLink.error ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {videoLink.error}
              </p>
            ) : null}
          </div>

          {channelInfo.title && channelInfo.id ? (
            <section className="flex flex-col gap-3">
              <h1 className="text-base">
                <a
                  href={`https://www.youtube.com/channel/${channelInfo.id}`}
                  className="text-primary hover:underline hover:underline-offset-2"
                  target="_blank"
                >
                  {channelInfo.title}
                </a>
              </h1>
              <div className="flex gap-3 flex-col md:flex-row flex-grow">
                <Button
                  disabled={fetchedChannelPlaylists}
                  className="md:w-1/2"
                  onClick={fetchChannelPlaylists}
                >
                  Get playlists
                </Button>
                <Button className="md:w-1/2" onClick={addChannelToLocal}>
                  Add channel
                </Button>
              </div>
              <ShowPlaylist
                channelPlaylists={channelPlaylists}
                catalogId={catalogId}
              />
            </section>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
