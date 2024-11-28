import { DeleteIcon, EditIcon } from "~/components/custom/icons";
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

type ArchiveTableProps = {
  archives: any[];
  onDelete: (archiveId: string) => Promise<void>;
  onEdit: (archiveId: string) => void;
};

function ArchiveTable({ archives, onDelete, onEdit }: ArchiveTableProps) {
  return (
    <Table>
      <TableCaption>A list of archives.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[200px] font-semibold">Title</TableHead>
          <TableHead className="max-w-[150px] font-semibold">
            Archive ID
          </TableHead>
          <TableHead className="font-semibold">Description</TableHead>
          <TableHead className="text-center font-semibold">
            Last updated
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {archives?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No archive added yet.
            </TableCell>
          </TableRow>
        ) : (
          archives?.map((archive) => (
            <TableRow key={archive?.id}>
              <TableCell>{archive?.title}</TableCell>
              <TableCell>{archive?.id}</TableCell>
              <TableCell>{archive?.description}</TableCell>
              <TableCell className="text-center">
                {getTimeDifference(archive?.videoData?.updatedAt)[1]}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center justify-end">
                  <JustTip label="Edit Catalog">
                    <Button
                      variant="outline"
                      onClick={() => onEdit(archive?.id)}
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
                      onClick={() => onDelete(archive?.id)}
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

export default ArchiveTable;
