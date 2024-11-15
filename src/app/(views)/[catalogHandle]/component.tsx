import { YouTubeEmbed } from "@next/third-parties/google";

export const YoutubePlayer = (props: any) => {
  const { videoId, title } = props;

  return (
    // <div className="rainbow-border">
      <YouTubeEmbed
        params="rel=0&playsinline=1&cc_load_policy=0"
        videoid={videoId}
        playlabel={title}
      />
    // </div>
  );
};
