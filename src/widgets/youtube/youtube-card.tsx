import dynamic from "next/dynamic";

import { YouTubeCardProps } from "~/shared/types-schema/types";

import { ChannelMeta, DescriptionSheet } from "./components";
import ShowCardOption from "./show-card-options";

const ClientYouTubePlayer = dynamic(() => import("./player"), {
  ssr: false,
});

export default function YouTubeCard(props: YouTubeCardProps) {
  const { video, options } = props;

  const { videoId, title, description } = video;

  const {
    enableJsApi = false,
    hideAvatar = false,
    addWatchLater = false,
    removeWatchLater = false,
  } = options ?? {};

  return (
    <div className="flex flex-col gap-3">
      <div key={videoId} className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video overflow-hidden">
          <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
          <DescriptionSheet title={title} description={description} />
        </div>
        <ShowCardOption
          video={video}
          addWatchLater={addWatchLater}
          removeWatchLater={removeWatchLater}
        />
        <div className="p-3">
          <ChannelMeta hideAvatar={hideAvatar} {...video} />
        </div>
      </div>
    </div>
  );
}
