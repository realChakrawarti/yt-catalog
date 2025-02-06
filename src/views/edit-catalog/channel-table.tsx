import { Button } from "~/shared/ui/button";
import { DeleteIcon } from "~/shared/ui/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/ui/table";
import { DeleteModal } from "~/widgets/delete-modal";
import { OutLink } from "~/widgets/out-link";

function ChannelTable({ channels, handleDelete }: any) {
  return (
    <Table>
      <TableCaption>A list of channels.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px] font-semibold">SL No</TableHead>
          <TableHead className="max-w-[150px] font-semibold">Channel</TableHead>
          <TableHead className="font-semibold">Channel ID</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {channels?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No channel added yet.
            </TableCell>
          </TableRow>
        ) : (
          channels?.map((channel: any, idx: number) => (
            <TableRow key={channel?.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  {channel?.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel?.logo}
                      alt={channel?.title}
                      className="size-4 rounded-lg"
                    />
                  ) : null}

                  {channel?.handle ? (
                    <OutLink
                      className="text-indigo-600 hover:text-indigo-500 visited:text-indigo-700"
                      href={`https://www.youtube.com/${channel?.handle}`}
                    >
                      <p>{channel?.title}</p>
                    </OutLink>
                  ) : (
                    <p>{channel?.title}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>{channel?.id}</TableCell>
              <TableCell>
                <DeleteModal
                  label={
                    <>
                      This action cannot be undone. This will permanently remove{" "}
                      <span className="text-primary">{channel.title}</span>{" "}
                      channel from the catalog?
                    </>
                  }
                  onDelete={() => handleDelete(channel?.id)}
                >
                  <Button variant="outline">
                    <DeleteIcon
                      size={24}
                      className="text-red-700 hover:text-red-500 cursor-pointer"
                    />
                  </Button>
                </DeleteModal>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default ChannelTable;
