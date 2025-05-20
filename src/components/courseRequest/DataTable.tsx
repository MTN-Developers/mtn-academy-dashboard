// DataTable.tsx
import { useState, useEffect } from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import EditRequestModal from "./editRequestsModal";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isLoading?: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  onSearchChange: (search: string) => void;
  includeActionColumn?: boolean;
  onDeleteSelected?: (selectedIds: string[]) => void;
}

const DataTable = <TData extends { id: string }>({
  columns,
  data,
  meta,
  isLoading,
  pagination,
  onPaginationChange,
  onSearchChange,
  includeActionColumn = false,
  onDeleteSelected,
}: DataTableProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const columnHelper = createColumnHelper<TData>();

  // Action column configuration
  const actionColumn: ColumnDef<TData> = columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center">
        <button
          type="button"
          title="Assign Course"
          onClick={() => {
            setSelectedItem(row.original);
            setIsModalOpen(true);
          }}
          className="btn btn-square btn-ghost"
        >
          <HiOutlinePencilSquare className="w-5 h-5" />
        </button>
      </div>
    ),
  });

  /**
   * Debounce the search:
   * Wait 500 ms after the user finishes typing before
   * calling onSearchChange() with the trimmed string.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only call the parent onSearchChange after 500 ms
      onSearchChange(globalFilter.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [globalFilter, onSearchChange]);

  const table = useReactTable({
    data,
    columns: includeActionColumn ? [...columns, actionColumn] : columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: meta?.total || 0,
  });

  return (
    <div className="w-full bg-base-100 text-base-content">
      <div className="flex justify-between items-center mb-2">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value.trim())}
          placeholder="Search users..."
          className="input input-bordered max-w-xs"
          disabled={isLoading}
        />
      </div>

      <div className="rounded-xl overflow-x-auto shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-base-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {onDeleteSelected && (
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      className="checkbox checkbox-sm"
                      title="Select all"
                    />
                  </th>
                )}
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide"
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
          <tbody className="divide-y divide-gray-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {onDeleteSelected && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                      className="checkbox checkbox-sm"
                      title="Select row"
                    />
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && !isLoading && (
          <div className="text-center py-6 text-gray-400">
            No data available
          </div>
        )}
      </div>

      {meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
          <div className="text-sm text-gray-600">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            entries
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() =>
                onPaginationChange({
                  pageIndex: pagination.pageIndex - 1,
                  pageSize: pagination.pageSize,
                })
              }
              disabled={!meta.hasPreviousPage || isLoading}
            >
              Previous
            </button>
            <button className="join-item btn btn-sm">Page {meta.page}</button>
            <button
              className="join-item btn btn-sm"
              onClick={() =>
                onPaginationChange({
                  pageIndex: pagination.pageIndex + 1,
                  pageSize: pagination.pageSize,
                })
              }
              disabled={!meta.hasNextPage || isLoading}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Example for a separate modal */}
      {isModalOpen && selectedItem && (
        <EditRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedItem as any}
        />
      )}
    </div>
  );
};

export default DataTable;
