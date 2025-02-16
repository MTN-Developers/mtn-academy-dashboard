import { Semester } from "../../types/semesters";
import EditSemesterForm from "./EditSemesterForm";

interface ISemesterProps {
  id: string;
  name_ar: string;
  description_ar: string;
  image_url_ar: string;
  created_at: string;
  price: number;
  slug: string;
  semester: Semester;
}

const SemesterCard = ({
  image_url_ar,
  name_ar,
  description_ar,
  semester,
}: ISemesterProps) => {
  //handlers
  const handleOpenEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${semester.id}`
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${semester.id}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };
  return (
    <div className="card bg-base-100 w-auto shadow-xl">
      <figure className="h-[150px] bg-gray-200">
        <img className="object-cover" src={image_url_ar} alt={name_ar} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name_ar}</h2>
        <p>{description_ar}</p>
        <div className="card-actions justify-end">
          <div className="card-actions justify-end">
            <button className="btn btn-success" onClick={handleOpenEditModal}>
              Edit Semester
            </button>
          </div>
          {/* Edit Dialog */}
          <dialog id={`edit_modal_${semester.id}`} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit Semester</h3>

              <EditSemesterForm
                semester={semester}
                onSuccess={handleCloseEditModal}
                onCancel={handleCloseEditModal}
              />
            </div>
          </dialog>

          <button className="btn btn-primary">See Related Courses</button>
        </div>
      </div>
    </div>
  );
};

export default SemesterCard;
