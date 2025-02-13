import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

/** 1) Define the Zod schema and TS type */
const createSemesterSchema = z.object({
  name_ar: z.string().nonempty("Arabic name is required"),
  name_en: z.string().nonempty("English name is required"),
  description_ar: z.string().nonempty("Arabic description is required"),
  description_en: z.string().nonempty("English description is required"),
  slug: z.string().nonempty("Slug is required"),
  promotion_video_url: z.string().nonempty("Promotion video URL is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  image_url_ar: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "Arabic image is required."
    ),

  image_url_en: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "Arabic image is required."
    ),
});
type CreateSemesterFormData = z.infer<typeof createSemesterSchema>;

/** 2) Props to handle success or closing a modal, if desired */
interface CreateSemesterFormProps {
  onSuccess?: () => void; // optional callback if parent wants to do something on success
  onCancel?: () => void; // optional callback if parent wants to do something on cancel
}

const CreateSemesterForm: React.FC<CreateSemesterFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  /** 3) Set up React Hook Form */

  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSemesterFormData>({
    resolver: zodResolver(createSemesterSchema),
  });

  /** 4) Submit handler */
  const onSubmit = async (data: CreateSemesterFormData) => {
    setIsSubmitting(true); // Set loading to true when submission starts
    try {
      setServerError(null); // Reset any previous error

      const formData = new FormData();
      formData.append("name_ar", data.name_ar);
      formData.append("name_en", data.name_en);
      formData.append("description_ar", data.description_ar);
      formData.append("description_en", data.description_en);
      formData.append("slug", data.slug);
      formData.append("promotion_video_url", data.promotion_video_url);
      formData.append("price", String(data.price));

      if (data.image_url_ar?.[0]) {
        formData.append("image_url_ar", data.image_url_ar[0]);
      }
      if (data.image_url_en?.[0]) {
        formData.append("image_url_en", data.image_url_en[0]);
      }

      // Make POST request
      await axiosInstance.post("/semesters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Semester added successfully");
      queryClient.invalidateQueries({
        queryKey: ["semesters"],
      });

      onSuccess?.();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        // e.g. "Record already exists"
        setServerError(error.response.data.message ?? "Conflict error");
      } else {
        setServerError("Something went wrong, please try again.");
      }

      toast.error("Error adding semester");
      console.error("Error creating semester:", error);
    } finally {
      setIsSubmitting(false); // Set loading to false when submission ends
    }
  };

  /** 5) Render the form (no <dialog> here) */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="space-y-4"
    >
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
      <div>
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
      </div>

      {/* Image (Arabic) */}
      <div>
        <label className="block mb-1">Image (Arabic)</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          {...register("image_url_ar")}
        />
      </div>

      {/* Image (English) */}
      <div>
        <label className="block mb-1">Image (English)</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          {...register("image_url_en")}
        />
      </div>

      {/* If there's a server error, display it above the Save button */}
      {serverError && <p className="text-red-600">{serverError}</p>}

      {/* Form Buttons */}
      <div className="flex justify-end gap-2">
        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Loading...
            </>
          ) : (
            "Save"
          )}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={isSubmitting} // Optionally disable cancel while submitting
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateSemesterForm;
