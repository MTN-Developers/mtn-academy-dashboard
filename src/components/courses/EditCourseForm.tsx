// components/semesters/EditSemesterForm.tsx
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Course } from "../../types/courses";

const editCourseSchema = z.object({
  name_ar: z.string().nonempty("Arabic name is required"),
  name_en: z.string().nonempty("English name is required"),
  description_ar: z.string().nonempty("Arabic description is required"),
  description_en: z.string().nonempty("English description is required"),
  slug: z.string().nonempty("Slug is required"),
  promotion_video_url: z.string().nonempty("Promotion video URL is required"),
  // price: z.coerce.number().positive("Price must be a positive number"),
  logo_ar: z.any().optional(),
  logo_en: z.any().optional(),
});

type EditSemesterFormData = z.infer<typeof editCourseSchema>;

interface EditSemesterFormProps {
  course: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditCourseForm: React.FC<EditSemesterFormProps> = ({
  course,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditSemesterFormData>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      name_ar: course.name_ar,
      name_en: course.name_en,
      description_ar: course.description_ar,
      description_en: course.description_en,
      slug: course.slug,
      logo_ar: course.logo_ar,
      logo_en: course.logo_en,
      promotion_video_url: course.promotion_video_url || "",
      //   price: course.price,
    },
  });

  const onSubmit = async (data: EditSemesterFormData) => {
    // console.log("data", data);

    setIsSubmitting(true);
    try {
      setServerError(null);

      const formData = new FormData();
      formData.append("name_ar", data.name_ar);
      formData.append("name_en", data.name_en);
      formData.append("description_ar", data.description_ar);
      formData.append("description_en", data.description_en);
      formData.append("slug", data.slug);
      formData.append("promotion_video_url", data.promotion_video_url);
      //   formData.append("price", String(data.price));

      if (data.logo_ar instanceof FileList && data.logo_ar.length) {
        formData.append("logo_ar", data.logo_ar[0]);
      }
      if (data.logo_en instanceof FileList && data.logo_en.length) {
        formData.append("logo_en", data.logo_en[0]);
      }

      // Make PATCH request
      await axiosInstance.put(`/course/${course.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });

      onSuccess?.();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setServerError(error.response.data.message ?? "Conflict error");
      } else {
        setServerError("Something went wrong, please try again.");
      }
      toast.error("Error updating course");
      console.error("Error updating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="space-y-4"
    >
      {/* Form fields - same as CreateSemesterForm but with defaultValues */}
      {/* ... copy all the form fields from CreateSemesterForm ... */}
      {/* Arabic Name */}
      <div>
        <label className="block mb-1">Arabic Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("name_ar")}
        />
        {errors.name_ar && (
          <p className="text-red-500 text-sm">{errors.name_ar.message}</p>
        )}
      </div>

      {/* English Name */}
      <div>
        <label className="block mb-1">English Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("name_en")}
        />
        {errors.name_en && (
          <p className="text-red-500 text-sm">{errors.name_en.message}</p>
        )}
      </div>

      {/* Arabic Description */}
      <div>
        <label className="block mb-1">Arabic Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          {...register("description_ar")}
        />
        {errors.description_ar && (
          <p className="text-red-500 text-sm">
            {errors.description_ar.message}
          </p>
        )}
      </div>

      {/* English Description */}
      <div>
        <label className="block mb-1">English Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          {...register("description_en")}
        />
        {errors.description_en && (
          <p className="text-red-500 text-sm">
            {errors.description_en.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1">Slug</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>

      {/* Promotion Video URL */}
      <div>
        <label className="block mb-1">Promotion Video URL</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("promotion_video_url")}
        />
        {errors.promotion_video_url && (
          <p className="text-red-500 text-sm">
            {errors.promotion_video_url.message}
          </p>
        )}
      </div>

      {/* Price */}
      {/* <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          className="input input-bordered w-full"
          {...register("price")}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div> */}

      {/* Image (Arabic) */}
      <div>
        <label className="block mb-1">Image (Arabic)</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          {...register("logo_ar")}
        />
      </div>

      {/* Image (English) */}
      <div>
        <label className="block mb-1">Image (English)</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          {...register("logo_en")}
        />
      </div>

      {serverError && <p className="text-red-600">{serverError}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Loading...
            </>
          ) : (
            "Update"
          )}
        </button>

        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditCourseForm;
