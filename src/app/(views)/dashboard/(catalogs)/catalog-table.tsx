import { ReactNode } from "react";

import { DeleteIcon, EditIcon, WarningIcon } from "~/components/custom/icons";
import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/shadcn/table";
import { getTimeDifference } from "~/utils/client-helper";

type CatalogTableProps = {
  catalogs: any[];
  onDelete: (catalogId: string) => Promise<void>;
  onEdit: (catalogId: string) => void;
};

function CatalogTable({ catalogs, onDelete, onEdit }: CatalogTableProps) {
  return (
    <Table>
      <TableCaption>A list of catalogs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[200px] font-semibold">Title</TableHead>
          <TableHead className="max-w-[150px] font-semibold">
            Catalog ID
          </TableHead>
          <TableHead className="font-semibold">Description</TableHead>
          <TableHead className="text-center font-semibold">
            Last updated
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {catalogs?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No catalog added yet.
            </TableCell>
          </TableRow>
        ) : (
          catalogs?.map((catalog) => (
            <TableRow key={catalog?.id}>
              <TableCell>{catalog?.title}</TableCell>
              <TableCell>{catalog?.id}</TableCell>
              <TableCell>{catalog?.description}</TableCell>
              <TableCell className="text-center">
                {getTimeDifference(catalog?.videoData?.updatedAt)[1]}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center justify-end">
                  <JustTip label="Edit Catalog">
                    <Button
                      variant="outline"
                      onClick={() => onEdit(catalog?.id)}
                    >
                      <EditIcon
                        size={24}
                        className="text-sky-700 hover:text-sky-500 cursor-pointer"
                      />
                    </Button>
                  </JustTip>

                  <DeleteModal handleDelete={() => onDelete(catalog?.id)}>
                    <Button variant="outline">
                      <DeleteIcon
                        size={24}
                        className="text-primary/70 hover:text-primary cursor-pointer"
                      />
                    </Button>
                  </DeleteModal>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default CatalogTable;

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
          <DialogTitle className="flex items-center gap-2">
            <WarningIcon className="h-5 w-5 text-primary" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            This action is irreversible. The catalog will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
          <DialogClose>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
