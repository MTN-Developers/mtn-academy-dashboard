// DataTable.tsx
import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import AssignCourseModal from "./users/AssignCourseModal";
import { Course } from "../types/courses";

interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  slug: string;
  includeActionColumn: boolean;
}

interface UserData {
  id: string | number;
  name: string;
  email: string;
  assignedCourses?: Course[];
  [key: string]: any;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  // const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleAssignCourse = (user: UserData): void => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast("No items selected!", { icon: "⚠️" });
      return;
    }
    toast.success(`${selectedRows.length} items deleted successfully!`);
    // Here, you should call an API to delete the selected rows
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => (
      <div className="flex items-center">
        <button
          type="button"
          title="View details"
          onClick={() => navigate(`/${slug}/${params.row.id}`)}
          className="btn btn-square btn-ghost"
        >
          <HiOutlineEye />
        </button>
        <button
          type="button"
          title="Assign Course"
          onClick={() => handleAssignCourse(params.row as UserData)}
          className="btn btn-square btn-ghost"
        >
          <HiOutlinePencilSquare />
        </button>
        <button
          type="button"
          title="Delete item"
          onClick={() => {
            toast("Jangan dihapus!", { icon: "😠" });
          }}
          className="btn btn-square btn-ghost"
        >
          <HiOutlineTrash />
        </button>
      </div>
    ),
  };

  return (
    <div className="w-full bg-base-100 text-base-content">
      <div className="flex justify-between items-center mb-2">
        {/* Page size selector */}
        {/* <select
          className="select"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={100}>100</option>
          <option value={1000}>1000</option>
        </select> */}

        {/* Bulk delete button */}
        {/* <button
          className="btn btn-danger"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
        >
          Delete Selected ({selectedRows.length})
        </button> */}
      </div>

      <DataGrid
        className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
        rows={rows}
        columns={
          includeActionColumn ? [...columns, actionColumn] : [...columns]
        }
        getRowHeight={() => "auto"}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10, 100, 1000]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection)
        }
        rowSelectionModel={selectedRows}
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />

      {/* Modal for assigning courses */}
      {isModalOpen && selectedUser && (
        <AssignCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default DataTable;
