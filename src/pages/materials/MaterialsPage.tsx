import { useParams } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useGetRelatedMaterials from "../../hooks/useGetRelatedMaterials";
import Loader from "../../components/Loader";
import { Material } from "../../types/materials";
import { format } from "date-fns";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

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

// Zod validation schema
const materialSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  file_en: z.string().url("Valid English file URL is required"),
  file_ar: z.string().url("Valid Arabic file URL is required"),
});

type MaterialFormData = z.infer<typeof materialSchema>;

const AddMaterialForm = ({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: MaterialFormData) =>
      axiosInstance.post("/course-material", {
        ...data,
        course_id: courseId,
      }),
    onSuccess: () => {
      toast.success("Material added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["relatedMaterials", courseId],
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to add material");
    },
  });

  const onSubmit = (data: MaterialFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">English Title</span>
            </label>
            <input
              type="text"
              {...register("title_en")}
              className="input input-bordered w-full"
            />
            {errors.title_en && (
              <span className="text-red-500 text-sm">
                {errors.title_en.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Arabic Title</span>
            </label>
            <input
              type="text"
              {...register("title_ar")}
              className="input input-bordered w-full"
              dir="rtl"
            />
            {errors.title_ar && (
              <span className="text-red-500 text-sm">
                {errors.title_ar.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">English Description</span>
            </label>
            <textarea
              {...register("description_en")}
              className="textarea textarea-bordered w-full"
            />
            {errors.description_en && (
              <span className="text-red-500 text-sm">
                {errors.description_en.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Arabic Description</span>
            </label>
            <textarea
              {...register("description_ar")}
              className="textarea textarea-bordered w-full"
              dir="rtl"
            />
            {errors.description_ar && (
              <span className="text-red-500 text-sm">
                {errors.description_ar.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">English File URL</span>
            </label>
            <input
              type="url"
              {...register("file_en")}
              className="input input-bordered w-full"
            />
            {errors.file_en && (
              <span className="text-red-500 text-sm">
                {errors.file_en.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Arabic File URL</span>
            </label>
            <input
              type="url"
              {...register("file_ar")}
              className="input input-bordered w-full"
            />
            {errors.file_ar && (
              <span className="text-red-500 text-sm">
                {errors.file_ar.message}
              </span>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

const MaterialsPage = () => {
  const { courseId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    data: relatedMaterials,
    isError,
    error,
    isLoading,
  } = useGetRelatedMaterials({
    courseId: courseId || "",
  });

  const table = useReactTable({
    data: relatedMaterials || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.log("Error fetching related materials: ", error);
    return <div>Error fetching related materials</div>;
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Course Materials</h1>
        {/* here should go the button of modal of adding the new material */}
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          Add New Material
        </button>
      </div>

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

        {/* Add Material Modal */}
        <dialog
          open={showAddModal}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Material</h3>
            {courseId && (
              <AddMaterialForm
                courseId={courseId}
                onClose={() => setShowAddModal(false)}
              />
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowAddModal(false)}>close</button>
          </form>
        </dialog>

        {relatedMaterials?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No materials found for this course
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
