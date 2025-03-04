// src/components/videos/CreateVideoForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface CreateVideoFormProps {
  chapterId: string;
  nextIndex: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const createVideoSchema = z.object({
  title_ar: z.string().nonempty("Arabic title is required"),
  title_en: z.string().nonempty("English title is required"),
  description_ar: z.string().nonempty("Arabic description is required"),
  description_en: z.string().nonempty("English description is required"),
  video_url: z.string().nullable(),
  duration: z.number().positive("Duration must be a positive number"),
  has_task: z.boolean().default(false),
  index: z.number().int().positive("Index must be a positive integer"),
  chapter_id: z.string(),
});

type CreateVideoFormData = z.infer<typeof createVideoSchema>;

const CreateVideoForm = ({
  chapterId,
  nextIndex,
  onSuccess,
  onCancel,
}: CreateVideoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { courseSlug } = useParams();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateVideoFormData>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      index: nextIndex,
      chapter_id: chapterId,
      has_task: false,
      duration: 0,
      video_url: null,
      description_ar: "",
      description_en: "",
    },
  });

  // Set hidden field values when component mounts or props change
  useEffect(() => {
    setValue("chapter_id", chapterId);
    // We don't set index here anymore since the user can change it
  }, [setValue, chapterId]);

  const onSubmit = async (data: CreateVideoFormData) => {
    setIsSubmitting(true);
    try {
      setServerError(null);

      console.log("Creating video with data:", data);

      // Make POST request
      const response = await axiosInstance.post("/video", data);
      console.log("API response:", response.data);

      toast.success("Video added successfully");

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["course-by-slug", courseSlug],
      });

      onSuccess?.();
      reset();
    } catch (error: any) {
      console.error("Error creating video:", error);

      if (error?.response?.status === 400) {
        setServerError(error.response.data.message ?? "Invalid data provided");
      } else {
        setServerError("Something went wrong, please try again.");
      }

      toast.error("Error adding video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* Hidden chapter_id field */}
      <input type="hidden" {...register("chapter_id")} />

      {/* Arabic Title */}
      <div>
        <label className="block mb-1">Arabic Title</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title_ar")}
        />
        {errors.title_ar && (
          <p className="text-red-500 text-sm">{errors.title_ar.message}</p>
        )}
      </div>

      {/* English Title */}
      <div>
        <label className="block mb-1">English Title</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title_en")}
        />
        {errors.title_en && (
          <p className="text-red-500 text-sm">{errors.title_en.message}</p>
        )}
      </div>

      {/* Arabic Description */}
      <div>
        <label className="block mb-1">Arabic Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          {...register("description_ar")}
        ></textarea>
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
          rows={3}
          {...register("description_en")}
        ></textarea>
        {errors.description_en && (
          <p className="text-red-500 text-sm">
            {errors.description_en.message}
          </p>
        )}
      </div>

      {/* Video URL */}
      <div>
        <label className="block mb-1">Video URL</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g., uploads/folder/video_name"
          {...register("video_url")}
        />
        {errors.video_url && (
          <p className="text-red-500 text-sm">{errors.video_url.message}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label className="block mb-1">Duration (ms)</label>
        <input
          type="number"
          className="input input-bordered w-full"
          {...register("duration", { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      {/* Index - Now visible and editable */}
      <div>
        <label className="block mb-1">
          Index{" "}
          <span className="text-gray-500 text-sm">
            (Suggested: {nextIndex})
          </span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          {...register("index", { valueAsNumber: true })}
        />
        {errors.index && (
          <p className="text-red-500 text-sm">{errors.index.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          This determines the order of the video in the chapter. Higher numbers
          appear later.
        </p>
      </div>

      {/* Has Task */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Has Task</span>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register("has_task")}
          />
        </label>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="alert alert-error">
          <p>{serverError}</p>
        </div>
      )}

      {/* Form Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Adding...
            </>
          ) : (
            "Add Video"
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

export default CreateVideoForm;
