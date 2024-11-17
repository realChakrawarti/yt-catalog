"use client";

import { useEffect, useMemo, useState } from "react";

import { CopyIcon, ShareIcon } from "~/components/custom/icons";
import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
import { toast } from "~/hooks/use-toast";

export default function ShareCatalog(props: any) {
  const [isNativeShare, setIsNativeShare] = useState<boolean>(false);

  const share = useMemo(
    () => ({
      title: props.catalogTitle,
      text: props.catalogDescription,
      url: `https://ytcatalog.707x.in/@${props.catalogId}`,
    }),
    [props]
  );

  const copyLink = () => {
    navigator.clipboard.writeText(share.url);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    });
  };

  const shareLink = async () => {
    try {
      await navigator.share(share);
    } catch (err) {
      if (err instanceof Error) {
        return toast({ title: err.message });
      }

      return toast({ title: "Something went wrong!" });
    }
  };

  useEffect(() => {
    if (navigator.canShare(share)) {
      setIsNativeShare(true);
    }
  }, [share]);

  // TODO: Share doesn't seem to work? Only copy is rendering
  if (isNativeShare) {
    return (
      <JustTip label="Copy to clipboard">
        <Button variant="outline" onClick={copyLink}>
          <CopyIcon className="size-8" />
        </Button>
      </JustTip>
    );
  } else {
    return (
      <JustTip label="Share catalog">
        <Button variant="outline" onClick={shareLink}>
          <ShareIcon className="size-8" />
        </Button>
      </JustTip>
    );
  }
}
