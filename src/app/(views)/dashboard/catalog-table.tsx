import Link from "next/link";

import { DeleteIcon, EditIcon, LinkIcon } from "~/components/custom/icons";
import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
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

                  <JustTip label="Remove Catalog">
                    <Button
                      variant="outline"
                      onClick={() => onDelete(catalog?.id)}
                    >
                      <DeleteIcon
                        size={24}
                        className="text-red-700 hover:text-red-500 cursor-pointer"
                      />
                    </Button>
                  </JustTip>
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
