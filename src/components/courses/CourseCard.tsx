import { useNavigate } from "react-router-dom";
import { Course } from "../../types/courses";
import EditCourseForm from "./EditCourseForm";

interface IProps {
  course: Course;
}

const CourseCard = ({ course }: IProps) => {
  const navigate = useNavigate();
  //handlers
  const handleOpenEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${course.id}`
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      `edit_modal_${course.id}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  const handleViewChapters = () => {
    navigate(
      `/semesters/${course.semester_id}/courses/${course.slug}/chapters`
    );
  };

  const handleOpenMaterials = () => {
    navigate(`/semesters/${course.semester_id}/courses/${course.id}/materials`);
  };

  return (
    <>
      <div
        key={course.id}
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Card Image */}
        <figure className="relative pt-[56.25%]">
          {" "}
          {/* 16:9 aspect ratio */}
          <img
            src={course.logo_ar}
            alt={course.name_ar}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </figure>

        {/* Card Content */}
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg">{course.name_ar}</h2>
            <div className="badge badge-primary">{course.index}</div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description_ar}
          </p>

          {/* Course Details */}
          <div className="mt-4 space-y-2">
            {course.course_duration && (
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
                <span>{course.course_duration}</span>
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="card-actions justify-end mt-4">
            {/* Edit Dialog */}
            <dialog id={`edit_modal_${course.id}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Cousre</h3>

                <EditCourseForm
                  course={course}
                  onSuccess={handleCloseEditModal}
                  onCancel={handleCloseEditModal}
                />
              </div>
            </dialog>
            {/* Add this button to open the edit modal */}
            <button
              onClick={handleOpenMaterials}
              className="btn btn-active btn-info btn-sm"
            >
              Materials
            </button>

            <button
              onClick={handleOpenEditModal}
              className="btn btn-success btn-sm"
            >
              Edit
            </button>

            <button
              onClick={handleViewChapters}
              className="btn btn-primary btn-sm"
            >
              See Chapters
            </button>
            {/* <button className="btn btn-outline btn-sm">Enroll Now</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
