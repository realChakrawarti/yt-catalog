import { DeleteIcon } from "~/components/custom/icons";
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

function ChannelTable({ channels, handleDelete }: any) {
  return (
    <Table>
      <TableCaption>A list of channels.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px] font-semibold">SL No</TableHead>
          <TableHead className="max-w-[150px] font-semibold">
            Channel Title
          </TableHead>
          <TableHead className="font-semibold">Channel ID</TableHead>
          <TableHead className="text-center font-semibold">
            Channel Topics
          </TableHead>
          <TableHead>Channel Handle</TableHead>
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
                {" "}
                <div className="flex gap-2 items-center">
                  {" "}
                  {channel?.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel?.logo}
                      alt={channel?.title}
                      className="size-4 rounded-lg"
                    />
                  ) : null}
                  <p>{channel?.title}</p>
                </div>
              </TableCell>
              <TableCell>{channel?.id}</TableCell>
              <TableCell className="text-center">
                {channel?.topics ? channel?.topics.join(", ") : "N/A"}
              </TableCell>
              <TableCell>
                {channel?.handle ? (
                  <a
                    className="text-indigo-600 hover:text-indigo-500 visited:text-indigo-700"
                    target="_blank"
                    href={`https://www.youtube.com/${channel?.handle}`}
                  >
                    {channel?.handle}
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <JustTip label="Remove Channel">
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(channel?.id)}
                  >
                    <DeleteIcon
                      size={24}
                      className="text-red-700 hover:text-red-500 cursor-pointer"
                    />
                  </Button>
                </JustTip>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default ChannelTable;
