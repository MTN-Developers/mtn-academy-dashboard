// NoteModal.tsx
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserNote } from "../../api/ApiCollection";
import toast from "react-hot-toast";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; note?: string };
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, user }) => {
  const [note, setNote] = React.useState(user.note || "");
  const queryClient = useQueryClient();

  // Update the user's note with a PATCH request
  const mutation = useMutation({
    mutationFn: (newNote: string) => updateUserNote(user.id, newNote),
    onSuccess: () => {
      toast.success("Note updated successfully!");
      // Re-fetch the users list so the table updates
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update note!");
    },
  });

  // If the modal re-opens for a different user, keep note in sync:
  React.useEffect(() => {
    setNote(user.note || "");
  }, [user]);

  const handleSave = () => {
    mutation.mutate(note);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Note</h3>
        <label htmlFor="user-note" className="sr-only">
          User Note
        </label>
        <textarea
          id="user-note"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter note here..."
          aria-label="User Note"
        ></textarea>
        <div className="modal-action">
          <button className="btn mx-4" onClick={onClose}>
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

export default NoteModal;
