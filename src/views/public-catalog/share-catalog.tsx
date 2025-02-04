"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { useMemo } from "react";

import { toast } from "~/shared/hooks/use-toast";
import { Button } from "~/shared/ui/button";
import JustTip from "~/widgets/just-the-tip";

export default function ShareCatalog(props: any) {
  const shareData = useMemo(
    () => ({
      title: props.catalogTitle,
      text: props.catalogDescription,
      url: `https://ytcatalog.707x.in/c/${props.catalogId}`,
    }),
    [props]
  );

  const copyLink = () => {
    window.navigator.clipboard.writeText(shareData.url);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    });
  };

  const shareLink = async () => {
    try {
      await window.navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        return toast({ title: err.message });
      }

      return toast({ title: "Something went wrong!" });
    }
  };

  // Firefox doesn't support it yet, 23-11-2024
  if (
    typeof window.navigator.canShare === "function" &&
    window.navigator.canShare(shareData)
  ) {
    return (
      <JustTip label="Share catalog">
        <Button variant="outline" onClick={shareLink}>
          <ShareIcon className="size-8" />
        </Button>
      </JustTip>
    );
  } else {
    return (
      <JustTip label="Copy to clipboard">
        <Button variant="outline" onClick={copyLink}>
          <CopyIcon className="size-8" />
        </Button>
      </JustTip>
    );
  }
}
