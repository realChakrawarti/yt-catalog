import { Cell, Column, Row, TableHeader, Table } from "~/components/custom/Table";
import Link from "next/link";
import { TableBody, Tooltip } from "react-aria-components";
import { MdDeleteForever } from "react-icons/md";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaLink } from "react-icons/fa";
import { getTimeDifference } from "~/utils/client-helper";

type CatalogTableProps = {
  catalogs: any[];
  onDelete: (catalogId: string) => Promise<void>;
  onEdit: (catalogId: string) => void;
};

function CatalogTable({ catalogs, onDelete, onEdit }: CatalogTableProps) {
  return (
    <Table className="w-full" aria-label="Catalogs">
      <TableHeader className="py-2">
        <Column maxWidth={200}>Title</Column>
        <Column maxWidth={150} isRowHeader>
          Catalog ID
        </Column>
        <Column>Description</Column>
        <Column>Last updated</Column>
        <Column maxWidth={150}>Action</Column>
      </TableHeader>
      <TableBody
        renderEmptyState={() => <div className="text-center">Loading</div>}
      >
        {catalogs?.map((catalog) => (
          <Row className="py-2" key={catalog?.id}>
            <Cell>{catalog?.title}</Cell>
            <Cell>{catalog?.id}</Cell>
            <Cell>{catalog?.description}</Cell>
            <Cell>{getTimeDifference(catalog?.videoData?.updatedAt)[1]}</Cell>
            <Cell>
              <div className="flex gap-2 items-center">
                <HiOutlinePencilAlt
                  onClick={() => onEdit(catalog?.id)}
                  size="18"
                  className="text-sky-700 hover:text-sky-500 cursor-pointer"
                />
                <Tooltip>Edit Catalog</Tooltip>

                <MdDeleteForever
                  onClick={() => onDelete(catalog?.id)}
                  size="18"
                  className="text-red-700 hover:text-red-500 cursor-pointer"
                />

                <Link href={`/@${catalog?.id}`}>
                <FaLink size="18" className="cursor-pointer text-gray-400" /> 
                </Link>
              </div>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

export default CatalogTable;
