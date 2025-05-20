import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCourseRequest } from "../../hooks/courseRequest/useGetAllRequest";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: { id: string; status: string; note?: string };
}

const EditRequestModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const [note, setNote] = React.useState(request.note || "");
  const [status, setStatus] = React.useState(request.status);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { note: string; status: string }) =>
      updateCourseRequest(request.id, data),
    onSuccess: () => {
      toast.success("Request updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update request!");
    },
  });

  React.useEffect(() => {
    setNote(request.note || "");
    setStatus(request.status);
  }, [request]);

  const handleSave = () => {
    mutation.mutate({ note, status });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Request</h3>

        {/* Status Dropdown */}
        <label htmlFor="status" className="label font-semibold mt-4">
          Status
        </label>
        <select
          id="status"
          className="select select-bordered w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Note Textarea */}
        <label htmlFor="user-note" className="label font-semibold">
          Note
        </label>
        <textarea
          id="user-note"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter note here..."
        />

        {/* Actions */}
        <div className="modal-action flex gap-2">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRequestModal;
