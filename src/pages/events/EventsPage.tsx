import { useMemo, useState } from "react";
import useGetAllEvents from "../../hooks/useGetAllEvents";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../lib/axios";

// interface EventTableData {
//   data: Event[];
//   meta: MetaData;
// }
const eventSchema = z.object({
  title_ar: z.string().min(1, "Arabic title is required"),
  title_en: z.string().min(1, "English title is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  description_en: z.string().min(1, "English description is required"),
  semester_id: z.string().min(1, "Semester is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

const EventsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError } = useGetAllEvents({ limit, page });
  const { data: semesters } = useGetAllSemesters();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await axiosInstance.post("/events", data);
      queryClient.invalidateQueries(["events"]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        accessorKey: "title_en",
        header: "English Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "title_ar",
        header: "Arabic Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta?.totalPages || -1,
    state: {
      pagination: {
        pageIndex: page - 1, // Convert to zero-based index
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const newPage =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: limit })
          : updater;
      setPage(newPage.pageIndex + 1);
      setLimit(newPage.pageSize);
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading events</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add New Event
        </button>
      </div>

      {/* DaisyUI Modal */}
      <dialog open={isModalOpen} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Event</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Arabic Title</span>
              </label>
              <input
                {...register("title_ar")}
                className="input input-bordered"
              />
              {errors.title_ar && (
                <span className="text-error">{errors.title_ar.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">English Title</span>
              </label>
              <input
                {...register("title_en")}
                className="input input-bordered"
              />
              {errors.title_en && (
                <span className="text-error">{errors.title_en.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Arabic Description</span>
              </label>
              <textarea
                {...register("description_ar")}
                className="textarea textarea-bordered"
              />
              {errors.description_ar && (
                <span className="text-error">
                  {errors.description_ar.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">English Description</span>
              </label>
              <textarea
                {...register("description_en")}
                className="textarea textarea-bordered"
              />
              {errors.description_en && (
                <span className="text-error">
                  {errors.description_en.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Semester</span>
              </label>
              <select
                {...register("semester_id")}
                className="select select-bordered"
              >
                <option value="">Select Semester</option>
                {semesters?.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name_en} / {semester.name_ar}
                  </option>
                ))}
              </select>
              {errors.semester_id && (
                <span className="text-error">{errors.semester_id.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                {...register("start_date")}
                className="input input-bordered"
              />
              {errors.start_date && (
                <span className="text-error">{errors.start_date.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                {...register("end_date")}
                className="input input-bordered"
              />
              {errors.end_date && (
                <span className="text-error">{errors.end_date.message}</span>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {data?.meta?.totalPages || 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <label htmlFor="page-size-select" className="sr-only">
          Items per page
        </label>
        <select
          id="page-size-select"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); // Reset to first page when changing page size
          }}
          className="px-4 py-2 border rounded-md"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventsPage;
