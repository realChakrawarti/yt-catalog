import { Cell, Column, Row, TableHeader, Table } from "@/app/components/Table";
import { TableBody } from "react-aria-components";

type CatalogTableProps = {
  catalogs: any[];
};

function dateTimeString(date: Date) {
  return date.toDateString() + ' ' + date.toTimeString().split("(")[0];
}

function CatalogTable({ catalogs }: CatalogTableProps) {
  return (
    <Table className="w-full" aria-label="Catalogs">
      <TableHeader className="py-2">
        <Column isRowHeader>Catalog ID</Column>
        <Column>Title</Column>
        <Column>Description</Column>
        <Column>Updated at</Column>
      </TableHeader>
      <TableBody renderEmptyState={() => <div className="text-center">Loading</div>}>
        {catalogs?.map((catalog) => (
          <Row
          className="py-2"
            key={catalog?.id}
            href={`/catalog/${catalog?.id}`}
            target="_blank"
          >
            <Cell>{catalog?.id}</Cell>
            <Cell>{catalog?.title}</Cell>
            <Cell>{catalog?.description}</Cell>
            <Cell>
              {dateTimeString(
                new Date(catalog?.videoData?.updatedAt?.seconds * 1000)
              )}
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

export default CatalogTable;
