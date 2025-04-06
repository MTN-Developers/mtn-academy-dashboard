import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

interface CreateAssigmentFormProps {
  videoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateAssigmentFormSchema = z.object({
  video_id: z.string().nonempty("Video ID is required"),
  question: z.string().nonempty("Question is required"),
});

type CreateAssigmentFormData = z.infer<typeof CreateAssigmentFormSchema>;

const CreateAssigmentForm = ({
  videoId,
  onSuccess,
  onCancel,
}: CreateAssigmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateAssigmentFormData>({
    resolver: zodResolver(CreateAssigmentFormSchema),
    defaultValues: {
      video_id: videoId,
      question: "",
    },
  });

  const onSubmit = async (data: CreateAssigmentFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await axiosInstance.post("/video-assignment/question", data);
      toast.success("Assignment created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["video-assignment", videoId],
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      if (error?.response?.status === 400) {
        setServerError(error.response.data.message ?? "Invalid data provided");
      } else {
        setServerError("Something went wrong, please try again.");
      }
      setServerError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>CreateAssigmentForm</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Question */}
        <div>
          <label className="block mb-1">Question</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("question")}
          />
          {errors.question && (
            <p className="text-red-500 text-sm">{errors.question.message}</p>
          )}
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
              "Add Question"
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
    </div>
  );
};

export default CreateAssigmentForm;
