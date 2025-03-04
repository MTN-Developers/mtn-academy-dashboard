// src/components/videos/EditVideoForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Video } from "../../types/courses";
import { useParams } from "react-router-dom";

interface EditVideoFormProps {
  video: Video;
  chapterId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Updated schema to include index
const editVideoSchema = z.object({
  title_ar: z.string().nonempty("Arabic title is required"),
  title_en: z.string().nonempty("English title is required"),
  video_url: z.string().nullable(),
  index: z.number().int(),
});

type EditVideoFormData = z.infer<typeof editVideoSchema>;

const EditVideoForm = ({ video, onSuccess, onCancel }: EditVideoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { courseSlug } = useParams();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditVideoFormData>({
    resolver: zodResolver(editVideoSchema),
    defaultValues: {
      title_ar: video.title_ar,
      title_en: video.title_en,
      video_url: video.video_url,
      index: video.index,
    },
  });

  const onSubmit = async (data: EditVideoFormData) => {
    setIsSubmitting(true);
    try {
      setServerError(null);

      // Prepare the data for the API - now including index
      const updateData = {
        title_ar: data.title_ar,
        title_en: data.title_en,
        video_url: data.video_url,
        index: data.index,
      };

      console.log("Updating video with data:", updateData);

      // Make PATCH request
      await axiosInstance.patch(`/video/${video.id}`, updateData);

      toast.success("Video updated successfully");

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["course-by-slug", courseSlug],
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating video:", error);

      if (error?.response?.status === 400) {
        setServerError(error.response.data.message ?? "Invalid data provided");
      } else if (error?.response?.status === 404) {
        setServerError("Video not found");
      } else {
        setServerError("Something went wrong, please try again.");
      }

      toast.error("Error updating video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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

      {/* Video URL */}
      <div>
        <label className="block mb-1">Video URL</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("video_url")}
        />
        {errors.video_url && (
          <p className="text-red-500 text-sm">{errors.video_url.message}</p>
        )}
      </div>

      {/* Index - Now editable */}
      <div>
        <label className="block mb-1">
          Index{" "}
          <span className="text-gray-500 text-sm">
            (Current: {video.index})
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

      {/* Display other video information (read-only) */}
      <div className="bg-gray-100 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Other Video Information</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Duration:</span> {video.duration} ms
          </div>
          <div>
            <span className="font-medium">Has Task:</span>{" "}
            {video.has_task ? "Yes" : "No"}
          </div>
        </div>
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
              Updating...
            </>
          ) : (
            "Update Video"
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

export default EditVideoForm;
