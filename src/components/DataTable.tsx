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
import toast from "react-hot-toast";
import AssignCourseModal from "./users/AssignCourseModal";

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

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(globalFilter);
    }, 500);
    return () => clearTimeout(timeout);
  }, [globalFilter]);

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

  const handleDeleteSelected = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    if (selectedIds.length === 0) {
      toast("No items selected!", { icon: "⚠️" });
      return;
    }
    onDeleteSelected?.(selectedIds);
    setRowSelection({});
  };

  return (
    <div className="w-full bg-base-100 text-base-content">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          {onDeleteSelected && (
            <button
              className="btn btn-danger"
              onClick={handleDeleteSelected}
              disabled={table.getSelectedRowModel().rows.length === 0}
            >
              Delete Selected ({table.getSelectedRowModel().rows.length})
            </button>
          )}
        </div>

        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search users..."
          className="input input-bordered max-w-xs"
          disabled={isLoading}
        />
      </div>

      <div className="border rounded-lg overflow-x-auto shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {onDeleteSelected && (
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      title="Select row"
                      aria-label="Select row"
                    />
                  </th>
                )}
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
                {onDeleteSelected && (
                  <td className="px-6 py-4">
                    <label>
                      <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        title="Select row"
                        aria-label="Select row"
                      />
                      <span className="sr-only">Select row</span>
                    </label>
                  </td>
                )}
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

        {data.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
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

      {isModalOpen && selectedItem && (
        <AssignCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedItem as any}
        />
      )}
    </div>
  );
};

export default DataTable;
