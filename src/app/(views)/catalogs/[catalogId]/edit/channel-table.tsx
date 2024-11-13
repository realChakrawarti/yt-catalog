import { Cell, Column, Row, TableHeader, Table } from "~/components/custom/Table";
import { TableBody } from "react-aria-components";

function ChannelTable({ channels, handleDelete }: any) {
  return (
    <Table className="w-full" aria-label="Catalogs">
      <TableHeader className="py-2">
        <Column isRowHeader maxWidth={50}>
          SL No
        </Column>
        <Column>Channel Title</Column>
        <Column>Channel ID</Column>
        <Column>Channel Topics</Column>
        <Column>Channel Handle</Column>
        <Column maxWidth={75}></Column>
      </TableHeader>
      <TableBody
        renderEmptyState={() => <div className="text-center">Loading</div>}
      >
        {channels?.map((channel: any, idx: number) => (
          <Row className="py-2" key={channel?.id}>
            <Cell>{idx + 1}</Cell>
            <Cell>
              <div className="flex gap-2 items-center">
                {channel?.logo ? (
                  <img
                    src={channel?.logo}
                    alt={channel?.title}
                    className="size-4"
                  />
                ) : null}
                <p>{channel?.title}</p>
              </div>
            </Cell>
            <Cell>{channel?.id}</Cell>
            <Cell>{channel?.topics ? channel?.topics.join(", ") : "N/A"}</Cell>
            <Cell>
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
            </Cell>
            <Cell>
              <button onClick={() => handleDelete(channel?.id)}>Delete</button>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

export default ChannelTable;
