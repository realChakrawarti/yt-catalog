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

export default function AddVideoDialog({
  archiveId,
  revalidateArchive,
}: {
  archiveId: string;
  revalidateArchive: () => void;
}) {
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

  const addVideoLink = async () => {
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

      const videoMeta = {
        title: videoData.title,
        description: videoData.description,
        videoId: videoId,
        channelTitle: videoData.channelTitle,
        channelId: videoData.channelId,
        thumbnail: videoData.thumbnails.medium.url,
        publishedAt: videoData.publishedAt
      };

      const resultAdd = await fetchApi(`/archives/${archiveId}/update`, {
        method: "PATCH",
        body: JSON.stringify(videoMeta),
      });

      if (resultAdd.success) {
        toast({ title: resultAdd.message });
        revalidateArchive();
      }

      // Add doc to archive

      setVideoLink({
        link: "",
        error: "",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add video</Button>
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
              onClick={addVideoLink}
            >
              Add
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
