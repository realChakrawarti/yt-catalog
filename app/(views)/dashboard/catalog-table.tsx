import { Cell, Column, Row, TableHeader, Table } from "@/app/components/Table";
import Link from "next/link";
import { TableBody, Tooltip } from "react-aria-components";
import { MdDeleteForever } from "react-icons/md";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoOpenOutline } from "react-icons/io5";
import { getTimeDifference } from "@/lib/client-helper";
import { Timestamp } from "firebase/firestore";

type CatalogTableProps = {
  catalogs: any[];
  onDelete: (catalogId: string) => Promise<void>;
  onEdit: (catalogId: string) => void;
};

function CatalogTable({ catalogs, onDelete, onEdit }: CatalogTableProps) {
  return (
    <Table className="w-full" aria-label="Catalogs">
      <TableHeader className="py-2">
        <Column maxWidth={150} isRowHeader>
          Catalog ID
        </Column>
        <Column maxWidth={200}>Title</Column>
        <Column>Description</Column>
        <Column>Last updated</Column>
        <Column maxWidth={150}>Action</Column>
      </TableHeader>
      <TableBody
        renderEmptyState={() => <div className="text-center">Loading</div>}
      >
        {catalogs?.map((catalog) => (
          <Row className="py-2" key={catalog?.id}>
            <Cell>
              <Link
                href={`/catalogs/${catalog?.id}`}
                className="text-indigo-600 hover:text-indigo-500 visited:text-indigo-700"
              >
                {catalog?.id}
              </Link>
            </Cell>
            <Cell>{catalog?.title}</Cell>
            <Cell>{catalog?.description}</Cell>
            <Cell>
              {getTimeDifference(catalog?.videoData?.updatedAt)[1]}
            </Cell>
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

                <Link href={`/catalogs/${catalog?.id}`}>
                  <IoOpenOutline
                    size="18"
                    className="text-gray-300 hover:text-gray-100 cursor-pointer"
                  />
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
