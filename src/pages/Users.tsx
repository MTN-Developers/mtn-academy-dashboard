// Users.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import toast from "react-hot-toast";

// The new import for our NoteModal
import NoteModal from "../components/users/NoteModal";

import { fetchUsers } from "../api/ApiCollection";

const Users = () => {
  // Pagination & search states
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  // State for controlling the Note modal
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [selectedUserForNote, setSelectedUserForNote] =
    React.useState<any>(null);

  // Close the modal
  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedUserForNote(null);
  };

  // Fetching users with React Query
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["users", pagination, searchQuery],
    queryFn: () =>
      fetchUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchQuery,
      }),
    staleTime: 5000,
  });

  const columnHelper = createColumnHelper<User>();

  // Define columns
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
        const courses = getValue() as string[];
        return courses.length > 0 ? (
          <div className="badge badge-success" />
        ) : (
          <div className="badge badge-warning" />
        );
      },
    }),
    columnHelper.accessor("note", {
      header: "Note",
      cell: ({ row, getValue }) => {
        const note = getValue();
        return (
          <button
            onClick={() => {
              setSelectedUserForNote(row.original);
              setIsNoteModalOpen(true);
            }}
          >
            {note ? (
              <div className="badge badge-dash badge-success text-white ">
                Edit note
              </div>
            ) : (
              <div className="badge badge-dash badge-warning">Add note</div>
            )}
          </button>
        );
      },
    }),
  ];

  // Toast notifications for loading/error/success
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
            {data?.data?.meta && (
              <span className="text-neutral font-medium text-base">
                {data.data.meta.total} Users Found
              </span>
            )}
          </div>
        </div>

        {/* The Table */}
        <DataTable
          columns={columns}
          data={data?.data?.data || []}
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

      {/* Render NoteModal if needed */}
      <NoteModal
        isOpen={isNoteModalOpen && selectedUserForNote !== null}
        onClose={handleCloseNoteModal}
        user={selectedUserForNote || { id: "", note: "" }}
      />
    </div>
  );
};

export default Users;
