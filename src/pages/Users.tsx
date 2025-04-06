// Users.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import { fetchUsers } from "../api/ApiCollection";
import toast from "react-hot-toast";

const Users = () => {
  //   const [isOpen, setIsOpen] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["users", pagination, searchQuery],
    queryFn: () =>
      fetchUsers({
        page: pagination.pageIndex + 1, // Convert to 1-based index
        limit: pagination.pageSize,
        search: searchQuery,
      }),
    staleTime: 5000, // Keeps previous data for 5 seconds
  });

  // console.log("Users data", data?.data.data);

  const columnHelper = createColumnHelper<User>();
  // Update columns definition with explicit typing
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex gap-3 items-center">
          <div className="avatar">
            <div className="w-6 xl:w-9 rounded-full">
              <img
                src={row.original.profile.avatar || "/Portrait_Placeholder.png"}
                alt="user-picture"
              />
            </div>
          </div>
          <span className="mb-0 pb-0 leading-none">{row.original.name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue()).toISOString().split("T")[0],
    }),
    columnHelper.accessor("courses", {
      header: "has Courses",
      cell: ({ getValue }) => {
        console.log("Courses", getValue());
        const courses = getValue() as string[];
        return (
          <>
            {courses.length > 0 ? (
              <div className="badge badge-success"></div>
            ) : (
              <div className="badge badge-warning"></div>
            )}
          </>
        );
      },
    }),
  ];

  React.useEffect(() => {
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
              Users
            </h2>
            {data?.data.meta && (
              <span className="text-neutral font-medium text-base">
                {data.data.meta.total} Users Found
              </span>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data?.data.data || []}
          meta={data?.data?.meta}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          onSearchChange={setSearchQuery}
          includeActionColumn={true}
          onDeleteSelected={async (ids) => {
            console.log("Deleting", ids);
          }}
        />
      </div>
    </div>
  );
};

export default Users;
