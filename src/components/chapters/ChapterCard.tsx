import { Chapter } from "../../types/courses";
import EditChapterForm from "./EditChapterForm";

interface IProps {
  chapter: Chapter;
}

const ChapterCard = ({ chapter }: IProps) => {
  //handlers
  const handleOpenEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${chapter.id}`
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${chapter.id}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  // const handleViewChapters = () => {
  //   navigate(
  //     `/semesters/${course.semester_id}/courses/${course.slug}/chapters`
  //   );
  // };
  return (
    <>
      <div
        key={chapter.id}
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Card Image */}
        {/* <figure className="relative pt-[56.25%]">
          {" "}
          <img
            src={chapter.logo_ar}
            alt={course.name_ar}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </figure> */}

        {/* Card Content */}
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg">{chapter.title_ar}</h2>
            <div className="badge badge-primary">{chapter.index}</div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {chapter.description_ar}
          </p>

          {/* chapter Details */}
          <div className="mt-4 space-y-2">
            {chapter.videos && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{chapter.videos.length} videos</span>
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="card-actions justify-end mt-4">
            {/* Edit Dialog */}
            <dialog id={`edit_modal_${chapter.id}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Cousre</h3>

                <EditChapterForm
                  chapter={chapter}
                  onSuccess={handleCloseEditModal}
                  onCancel={handleCloseEditModal}
                />
              </div>
            </dialog>
            {/* Add this button to open the edit modal */}
            <button
              onClick={handleOpenEditModal}
              className="btn btn-success btn-sm"
            >
              Edit
            </button>

            <button
              //   onClick={handleViewChapters}
              className="btn btn-primary btn-sm"
            >
              See Vidoes
            </button>
            {/* <button className="btn btn-outline btn-sm">Enroll Now</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterCard;
