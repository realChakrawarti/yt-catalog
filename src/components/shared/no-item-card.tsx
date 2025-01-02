import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "~/components/shadcn/card";

type NoItemCardProps = {
  icon: LucideIcon;
  title: string;
  subTitle?: string | undefined;
};
export default function NoItemCard({
  icon: Icon,
  title,
  subTitle,
}: NoItemCardProps) {
  return (
    <Card className="rounded-md border-dashed flex justify-center h-[200px]">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Icon className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">{title}</p>
        {subTitle ? (
          <p className="text-sm text-muted-foreground">{subTitle}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
