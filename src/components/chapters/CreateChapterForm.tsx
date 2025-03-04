import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreateChapterFormProps {
  newIndex: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  courseId: string;
}

const createChapterSchema = z.object({
  title_ar: z.string().nonempty("Arabic name is required"),
  title_en: z.string().nonempty("English name is required"),
  index: z.number(),
  type: z.string(),
  course_id: z.string(),
});

type CreateChapterFormData = z.infer<typeof createChapterSchema>;

const CreateChapterForm = ({
  newIndex,
  onCancel,
  onSuccess,
  courseId,
}: CreateChapterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateChapterFormData>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      index: newIndex,
      type: "lectures",
      course_id: courseId,
    },
  });

  // Set hidden field values
  useState(() => {
    setValue("index", newIndex);
    setValue("type", "lectures");
    setValue("course_id", courseId);
  });

  const onSubmit = async (data: CreateChapterFormData) => {
    console.log("Form data being submitted:", data);
    setIsSubmitting(true);

    try {
      setServerError(null);

      // Create form data
      const formData = new FormData();
      formData.append("title_ar", data.title_ar);
      formData.append("title_en", data.title_en);
      formData.append("course_id", data.course_id);
      formData.append("index", String(data.index));
      formData.append("type", data.type);

      console.log("Sending request to /chapter with data:", {
        title_ar: data.title_ar,
        title_en: data.title_en,
        course_id: data.course_id,
        index: data.index,
        type: data.type,
      });

      // Make POST request
      const response = await axiosInstance.post("/chapter", formData);
      console.log("API response:", response.data);

      toast.success("Chapter added successfully");
      queryClient.invalidateQueries({
        queryKey: ["course-by-slug", courseId],
      });

      // Force a refetch to ensure data is updated
      queryClient.refetchQueries({
        queryKey: ["course-by-slug", courseId],
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

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Hidden fields */}
      <input type="hidden" {...register("index", { valueAsNumber: true })} />
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("course_id")} />

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
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateChapterForm;
