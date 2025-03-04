import { z } from "zod";
import { Chapter } from "../../types/courses";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";

interface EditChapterFormProps {
  chapter: Chapter;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const editChapterSchema = z.object({
  title_ar: z.string().nonempty("Arabic name is required"),
  title_en: z.string().nonempty("English name is required"),
});

type editChapterFormData = z.infer<typeof editChapterSchema>;

const EditChapterForm = ({
  chapter,
  onCancel,
  onSuccess,
}: EditChapterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const navigation = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<editChapterFormData>({
    resolver: zodResolver(editChapterSchema),
    defaultValues: {
      title_ar: chapter.title_ar,
      title_en: chapter.title_en,
    },
  });

  const onSubmit = async (data: editChapterFormData) => {
    console.log("Form data being submitted:", data);
    setIsSubmitting(true);

    try {
      setServerError(null);

      // Create form data
      const formData = new FormData();
      formData.append("title_ar", data.title_ar);
      formData.append("title_en", data.title_en);

      console.log("Sending request to /chapter with data:", {
        title_ar: data.title_ar,
        title_en: data.title_en,
      });

      // Make POST request
      const response = await axiosInstance.patch(
        `/chapter/${chapter.id}`,
        formData
      );
      console.log("API response:", response.data);

      toast.success("Chapter added successfully");
      queryClient.invalidateQueries({
        queryKey: ["course-by-slug"],
      });

      // Force a refetch to ensure data is updated
      queryClient.refetchQueries({
        queryKey: ["course-by-slug"],
      });

      onSuccess?.();
      reset();
    } catch (error: any) {
      console.error("Full error object:", error);

      if (error?.response?.status === 409) {
        setServerError(error.response.data.message ?? "Conflict error");
      } else {
        setServerError(
          `Error: ${
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
          }`
        );
      }

      toast.error("Error adding chapter");
    } finally {
      setIsSubmitting(false);
      navigation(window.location.pathname);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Hidden fields */}
      {/* <input type="hidden" {...register("index", { valueAsNumber: true })} />
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("course_id")} /> */}

      {/* Arabic Name */}
      <div>
        <label className="block mb-1">Arabic Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title_ar")}
        />
        {errors.title_ar && (
          <p className="text-red-500 text-sm">{errors.title_ar.message}</p>
        )}
      </div>

      {/* English Name */}
      <div>
        <label className="block mb-1">English Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title_en")}
        />
        {errors.title_en && (
          <p className="text-red-500 text-sm">{errors.title_en.message}</p>
        )}
      </div>

      {/* Server error display */}
      {serverError && (
        <div className="alert alert-error">
          <p>{serverError}</p>
        </div>
      )}

      {/* Form Buttons */}
      <div className="flex justify-end gap-2">
        {/* Submit Button */}
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
            "Save"
          )}
        </button>

        {/* Cancel Button */}
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

export default EditChapterForm;
