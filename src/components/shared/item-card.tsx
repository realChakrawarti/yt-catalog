import { Check, Clock, Copy, Edit, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/dialog";
import { WarningIcon } from "~/components/shared/icons";
import JustTip from "~/components/shared/just-the-tip";
import { toast } from "~/hooks/use-toast";

function CopyButton({ id, type }: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const exploreType = type === "catalog" ? "c" : "a";
    navigator.clipboard
      .writeText(`https://ytcatalog.707x.in/${exploreType}/${id}`)
      .then(() => {
        setCopied(true);
        toast({ title: "Catalog link has been copied to your clipboard." });
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <JustTip label={`Copy ${type} link`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 relative group"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="sr-only">{`Copy ${type} link`}</span>
      </Button>
    </JustTip>
  );
}

export default function ItemCard({
  type,
  id,
  title,
  description,
  lastUpdated,
  onDelete,
  onEdit,
}: any) {
  return (
    <Card className="rounded-md group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none flex flex-col h-[200px]">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="flex items-start justify-between">
          <span className="text-lg line-clamp-2 flex-grow mr-2">{title}</span>
          <CopyButton id={id} type={type} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter className="justify-between items-center pt-4 border-t h-[52px]">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate max-w-[100px]">{lastUpdated}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(id)}
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit catalog</span>
          </Button>
          <DeleteModal handleDelete={() => onDelete(id)}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary/80 hover:text-primary"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete catalog</span>
            </Button>
          </DeleteModal>
        </div>
      </CardFooter>
    </Card>
  );
}

type DeleteModalProps = {
  handleDelete: () => void;
  children: ReactNode;
};

function DeleteModal({ children, handleDelete }: DeleteModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center md:justify-start">
            <WarningIcon className="h-5 w-5 text-primary" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            This action is irreversible. The catalog will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-3">
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
