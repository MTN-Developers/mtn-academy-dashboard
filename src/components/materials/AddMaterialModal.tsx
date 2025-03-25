// src/components/materials/AddMaterialModal.jsx

import AddMaterialForm from "./AddMaterialForm";

const AddMaterialModal = ({
  isOpen,
  onClose,
  courseId,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}) => {
  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Material</h3>
        <AddMaterialForm courseId={courseId} onClose={onClose} />
      </div>
      <form method="dialog" className="modal-backdrop ">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddMaterialModal;
