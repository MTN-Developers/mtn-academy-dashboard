// src/components/courses/CoursesTable.tsx
import { FC, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import { Course } from "../../types/courses";
import EditCourseForm from "./EditCourseForm";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@mui/material";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

interface CoursesTableProps {
  courses: Course[];
}

const columnHelper = createColumnHelper<Course>();

const CoursesTable: FC<CoursesTableProps> = ({ courses }) => {
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      courseId,
      newValue,
    }: {
      courseId: string;
      newValue: boolean;
    }) => {
      return axiosInstance.put(`/course/${courseId}`, {
        has_live: newValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Live status updated!");
    },
    onError: (err) => {
      console.log("Error", err);
      toast.error("Failed to update live status");
    },
  });

  const columns = [
    columnHelper.accessor("index", {
      header: "#",
      cell: (info) => <span>{info.getValue()}</span>,
    }),

    columnHelper.accessor("name_ar", {
      header: "Course Name",
      cell: (info) => (
        <div>
          <p className="font-semibold">{info.getValue()}</p>
          <p className="text-sm text-gray-500">{info.row.original.name_en}</p>
        </div>
      ),
    }),

    columnHelper.accessor("description_ar", {
      header: "Description",
      cell: (info) => (
        <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("has_live", {
      header: "Live",
      cell: (info) => {
        const course = info.row.original;
        const isEnabled = course.has_live;
        return (
          <Switch
            checked={isEnabled}
            onChange={(event) =>
              mutation.mutate({
                courseId: course.id,
                newValue: event.target.checked,
              })
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "green",
                "&:hover": {
                  backgroundColor: "rgba(0, 128, 0, 0.1)",
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "green",
              },
            }}
          />
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const course = info.row.original;
        return (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() =>
                navigate(
                  `/semesters/${course.semester_id}/courses/${course.slug}/chapters`
                )
              }
              className="btn btn-sm btn-primary"
            >
              Chapters
            </button>
            <button
              onClick={() =>
                navigate(
                  `/semesters/${course.semester_id}/courses/${course.id}/materials`
                )
              }
              className="btn btn-sm btn-info"
            >
              Materials
            </button>
            <button
              onClick={() =>
                navigate(
                  `/semesters/${course.semester_id}/courses/${course.id}/parcticalExercises`
                )
              }
              className="btn btn-sm btn-success"
            >
              Practical
            </button>
            <button
              onClick={() => setEditingCourse(course)}
              className="btn btn-sm btn-warning"
            >
              Edit
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Course</h3>
            <EditCourseForm
              course={editingCourse}
              onCancel={() => setEditingCourse(null)}
              onSuccess={() => setEditingCourse(null)}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CoursesTable;
