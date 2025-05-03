import { useNavigate } from "react-router-dom";
import { FreeStudyCourse } from "../../types/freeStudy";
import EditFreeStudyForm from "./EditFreeStudyForm";

interface IFreeStudyProps {
  id: string;
  name_ar: string;
  description_ar: string;
  image_url_ar: string;
  created_at: string;
  price: number;
  slug: string;
  study: FreeStudyCourse;
}

const FreeStudyCard = ({
  image_url_ar,
  name_ar,
  description_ar,
  study,
}: IFreeStudyProps) => {
  const navigate = useNavigate();
  //handlers
  const handleOpenEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${study.id}`
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${study.id}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  const handleViewCourses = () => {
    navigate(`/freestudy/${study.id}/study`);
  };
  return (
    <div className="card bg-base-100 w-auto shadow-xl">
      <figure className="h-[150px] bg-gray-200">
        <img className="object-cover" src={image_url_ar} alt={name_ar} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name_ar}</h2>
        <p>{description_ar}</p>
        <div className="card-actions justify-end ">
          <div className="card-actions justify-end w-full">
            <button
              className="btn btn-success w-full"
              onClick={handleOpenEditModal}
            >
              Edit Free Study
            </button>
          </div>
          {/* Edit Dialog */}
          <dialog id={`edit_modal_${study.id}`} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit Free study</h3>

              <EditFreeStudyForm
                study={study}
                onSuccess={handleCloseEditModal}
                onCancel={handleCloseEditModal}
              />
            </div>
          </dialog>

          <button
            className="btn btn-primary w-full"
            onClick={handleViewCourses}
          >
            See Related chapters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeStudyCard;
