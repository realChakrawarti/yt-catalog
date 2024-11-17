import { ListPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

type VideoLink = {
  link: string;
  error: string;
};

const YouTubeVideoLinkRegex =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

export default function ValidateVideoDialog({
  localChannel,
  savedChannels,
  setLocalChannel,
}: any) {
  const [videoLink, setVideoLink] = useState<VideoLink>({
    link: "",
    error: "",
  });
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
      const result = await fetchApi(`/youtube/videoId?videoId=${videoId}`);

      if (!result.success) {
        toast({ title: result.message });
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      const alreadyExists = localChannel.find(
        (item: any) => item.id === channelId
      );

      const alreadySaved = savedChannels?.find(
        (channel: any) => channel.id === channelId
      );

      if (!alreadyExists && !alreadySaved) {
        setLocalChannel((prev: any) => [
          ...prev,
          { id: channelId, title: channelTitle },
        ]);
        toast({ title: `${channelTitle}'s channel added to the list.` });
      } else if (alreadyExists) {
        toast({
          title: `${channelTitle}'s channel already added to the list.`,
        });
      } else if (alreadySaved) {
        toast({ title: `${channelTitle}'s channel already saved.` });
      }

      setVideoLink({
        link: "",
        error: "",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex gap-2 items-center">
            <ListPlus className="size-8" />
            <p>Add channel from video</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste YouTube video link</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter video URL"
              value={videoLink.link}
              onChange={handleVideoLink}
            />
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
      </DialogContent>
    </Dialog>
  );
}
