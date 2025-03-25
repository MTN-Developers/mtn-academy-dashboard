// src/components/materials/AddMaterialForm.jsx
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";

// Zod validation schema
const materialSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  // File validation will be handled separately
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
  const [fileEn, setFileEn] = useState<File | null>(null);
  const [fileAr, setFileAr] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState({
    file_en: "",
    file_ar: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: MaterialFormData & { file_en: File; file_ar: File }) => {
      const formData = new FormData();

      // Append text fields
      formData.append("title_en", data.title_en);
      formData.append("title_ar", data.title_ar);
      formData.append("description_en", data.description_en);
      formData.append("description_ar", data.description_ar);
      formData.append("course_id", courseId);

      // Append files
      formData.append("file_en", data.file_en);
      formData.append("file_ar", data.file_ar);

      return axiosInstance.post("/course-material", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
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

  const validateFiles = () => {
    let isValid = true;
    const newErrors = { file_en: "", file_ar: "" };

    if (!fileEn) {
      newErrors.file_en = "English file is required";
      isValid = false;
    }

    if (!fileAr) {
      newErrors.file_ar = "Arabic file is required";
      isValid = false;
    }

    setFileErrors(newErrors);
    return isValid;
  };

  const onSubmit = (data: MaterialFormData) => {
    if (!validateFiles()) return;

    mutation.mutate({
      ...data,
      file_en: fileEn!,
      file_ar: fileAr!,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    lang: "en" | "ar"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (lang === "en") {
        setFileEn(e.target.files[0]);
        setFileErrors((prev) => ({ ...prev, file_en: "" }));
      } else {
        setFileAr(e.target.files[0]);
        setFileErrors((prev) => ({ ...prev, file_ar: "" }));
      }
    }
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
              <span className="label-text">English File</span>
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "en")}
              className="file-input file-input-bordered w-full"
            />
            {fileErrors.file_en && (
              <span className="text-red-500 text-sm">{fileErrors.file_en}</span>
            )}
            {fileEn && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {fileEn.name}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Arabic File</span>
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "ar")}
              className="file-input file-input-bordered w-full"
            />
            {fileErrors.file_ar && (
              <span className="text-red-500 text-sm">{fileErrors.file_ar}</span>
            )}
            {fileAr && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {fileAr.name}
              </p>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost mx-4"
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

export default AddMaterialForm;
