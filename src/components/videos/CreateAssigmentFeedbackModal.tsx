import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

interface CreateAssigmentFeedbackModalProps {
  answerId: string;
  questionId: string; // Add the parent questionId

  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateAssigmentFeedbackModalSchema = z.object({
  feedback: z.string().nonempty("feedback ID is required"),
});

type CreateAssigmentFeedbackModalData = z.infer<
  typeof CreateAssigmentFeedbackModalSchema
>;

const CreateAssigmentFeedbackModal = ({
  answerId,
  questionId, // Add the parent questionId
  onSuccess,
  onCancel,
}: CreateAssigmentFeedbackModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateAssigmentFeedbackModalData>({
    resolver: zodResolver(CreateAssigmentFeedbackModalSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const onSubmit = async (data: CreateAssigmentFeedbackModalData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await axiosInstance.patch(`/video-assignment/answer/${answerId}`, data);
      toast.success("Assignment created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["question", questionId],
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
      <h1>CreateAssigmentFeedbackModal</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Question */}
        <div>
          <label className="block mb-1">Feedback</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("feedback")}
          />
          {errors.feedback && (
            <p className="text-red-500 text-sm">{errors.feedback.message}</p>
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
              "Add Feedback"
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

export default CreateAssigmentFeedbackModal;
