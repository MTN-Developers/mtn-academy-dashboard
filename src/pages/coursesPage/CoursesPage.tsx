// pages/courses/CoursesPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import useGetRelatedCourses from "../../hooks/useGetRelatedCourses";
import Loader from "../../components/Loader";
import CreateCourseForm from "../../components/courses/CreateCourseForm";
import CourseCard from "../../components/courses/CourseCard";

const CoursesPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();

  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useGetRelatedCourses(semesterId!);
  const courses = coursesResponse?.data;

  let lastIndex = 0;

  if (courses && courses?.length! > 0) {
    for (let i = 0; i < courses?.length!; i++) {
      if (courses[i].index >= lastIndex) {
        lastIndex = courses[i].index;
      }
    }
  }

  // console.log("Courses: ", courses);

  if (isLoading) {
    return <Loader />;
  }

  //handlres
  // Handler to show the dialog
  const handleOpenModal = () => {
    const dialog = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  // Handler to close the dialog
  const handleCloseModal = () => {
    const dialog = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading courses!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Semester Courses</h1>
          <p className="text-gray-600">
            Browse all available courses in this semester
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleOpenModal} className="btn  btn-primary">
            Add Course
          </button>
          <button
            onClick={() => navigate("/semesters")}
            className="btn btn-outline btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Semesters
          </button>
        </div>
      </div>

      {/* Dialog */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Course</h3>

          {/* Render the separate form component */}
          <CreateCourseForm
            newIndex={lastIndex + 1}
            onSuccess={handleCloseModal} // close on success
            onCancel={handleCloseModal} // close on cancel
          />
        </div>
      </dialog>

      {/* Courses Grid */}
      {courses?.length === 0 ? (
        <div className="card bg-base-200 p-8 text-center">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-600">
              This semester doesn't have any courses yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.map((course) => (
            <CourseCard course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
