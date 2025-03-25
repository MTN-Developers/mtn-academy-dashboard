// src/components/materials/MaterialsTable.jsx
import { format } from "date-fns";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Material } from "../../types/materials";

const columnHelper = createColumnHelper<Material>();

const columns = [
  columnHelper.accessor("title_en", {
    header: "Title (English)",
    cell: (info) => (
      <div className="text-left">
        <p className="font-medium">{info.getValue()}</p>
        <p className="text-sm text-gray-500">{info.row.original.title_ar}</p>
      </div>
    ),
  }),
  columnHelper.accessor("description_en", {
    header: "Description",
    cell: (info) => (
      <div className="text-left">
        <p>{info.getValue()}</p>
        <p className="text-sm text-gray-500">
          {info.row.original.description_ar}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("file_en", {
    header: "Files",
    cell: (info) => (
      <div className="flex flex-col gap-1">
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          English File
        </a>
        <a
          href={info.row.original.file_ar}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Arabic File
        </a>
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "Upload Date",
    cell: (info) => format(new Date(info.getValue()), "MMM dd, yyyy HH:mm"),
  }),
];

import { FC } from "react";

interface MaterialsTableProps {
  materials: Material[];
}

const MaterialsTable: FC<MaterialsTableProps> = ({ materials }) => {
  const table = useReactTable({
    data: materials || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg overflow-x-auto shadow-lg">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {materials?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No materials found for this course
        </div>
      )}
    </div>
  );
};

export default MaterialsTable;
