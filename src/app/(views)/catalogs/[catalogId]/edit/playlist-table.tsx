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
import { DeleteModal } from "~/components/shared/delete-modal";
import { DeleteIcon } from "~/components/shared/icons";

interface PlaylistTableProps {
  playlists: any[];
  handleDelete: (_id: string) => void;
}

export default function PlaylistTable({
  playlists,
  handleDelete,
}: PlaylistTableProps) {
  return (
    <Table>
      <TableCaption>A list of playlists.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px] font-semibold">SL No</TableHead>
          <TableHead className="max-w-[150px] font-semibold">
            Playlist Title
          </TableHead>
          <TableHead className="font-semibold">Playlist ID</TableHead>
          <TableHead className="text-center font-semibold">Channel</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlists?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No playlist added yet.
            </TableCell>
          </TableRow>
        ) : (
          playlists?.map((playlist: any, idx: number) => (
            <TableRow key={playlist?.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{playlist?.title}</TableCell>
              <TableCell>{playlist?.id}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  {playlist?.channelLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={playlist?.channelLogo}
                      alt={playlist?.channelTitle}
                      className="size-4 rounded-lg"
                    />
                  ) : null}
                  {playlist?.channelHandle ? (
                    <a
                      className="text-indigo-600 hover:text-indigo-500 visited:text-indigo-700"
                      target="_blank"
                      href={`https://www.youtube.com/${playlist?.channelHandle}`}
                    >
                      <p>{playlist?.channelTitle}</p>
                    </a>
                  ) : (
                    <p>{playlist?.channelTitle}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DeleteModal
                  label={
                    <>
                      This action cannot be undone. This will permanently remove{" "}
                      <span className="text-primary">{playlist.title}</span>{" "}
                      playlist from the catalog?
                    </>
                  }
                  onDelete={() => handleDelete(playlist?.id)}
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
