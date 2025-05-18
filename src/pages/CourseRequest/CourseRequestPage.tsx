import { createColumnHelper } from "@tanstack/react-table";
import useGetAllRequests from "../../hooks/courseRequest/useGetAllRequest";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../components/courseRequest/DataTable";

const CourseRequestsPage = () => {
  // Pagination & search states
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 15,
  });

  const { data, isLoading, isError, isSuccess } = useGetAllRequests({
    limit: pagination.pageSize,
    page: pagination.pageIndex,
    search,
  });

  const columnHelper = createColumnHelper<CourseRequest>();

  const columns = [
    columnHelper.accessor((row) => row.user.name, {
      id: "userName",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex gap-3 items-center">
          <div className="avatar">
            <div className="w-6 xl:w-9 rounded-full">
              <img
                src={row.original.user.avatar || "/Portrait_Placeholder.png"}
                alt="user-picture"
              />
            </div>
          </div>
          <span className="mb-0 pb-0 leading-none">
            {row.original.user.name}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.user.email, {
      id: "userEmail",
      header: "Email",
    }),
    columnHelper.accessor((row) => row.user.phone, {
      id: "userPhone",
      header: "Phone",
    }),
    columnHelper.accessor((row) => row.course.name_en, {
      id: "courseName",
      header: "Course",
    }),
    columnHelper.accessor(
      (row) => row.course.course_type.split("_").join(" "),
      {
        id: "courseType",
        header: "type",
      }
    ),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <span
            className={`badge ${
              status === "pending"
                ? "badge-warning"
                : status === "approved"
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor((row) => row.note, {
      id: "note",
      header: "Note",
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue()).toISOString().split("T")[0],
    }),
  ];

  // Toast notifications for loading/error/success
  useEffect(() => {
    const toastId = "usersFetch";
    if (isLoading) toast.loading("Loading...", { id: toastId });
    if (isError) toast.error("Error fetching data!", { id: toastId });
    if (isSuccess) toast.success("Data loaded!", { id: toastId });

    return () => toast.dismiss(toastId);
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl text-base-content">
              Course Requests
            </h2>
            {data?.meta && (
              <span className="text-neutral font-medium text-base">
                {data.meta.total} Requests Found
              </span>
            )}
          </div>
        </div>

        {/* The Table */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          meta={data?.meta}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          onSearchChange={setSearch}
          includeActionColumn={true}
          onDeleteSelected={async (ids) => {
            console.log("Deleting", ids);
          }}
        />
      </div>
    </div>
  );
};

export default CourseRequestsPage;
