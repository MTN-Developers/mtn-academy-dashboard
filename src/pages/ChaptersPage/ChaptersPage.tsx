import { useNavigate, useParams } from "react-router-dom";
import useGetCourseBySlug from "../../hooks/useGetCourseBySlug";
import Loader from "../../components/Loader";
import { Chapter } from "../../types/courses";
import ChapterCard from "../../components/chapters/ChapterCard";
import CreateChapterForm from "../../components/chapters/CreateChapterForm";

const ChaptersPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useGetCourseBySlug(courseSlug!);

  const chapters = course?.data.chapters;
  // console.log("Chapters: ", course);

  let lastIndex = 0;

  if (chapters && chapters?.length! > 0) {
    for (let i = 0; i < chapters?.length!; i++) {
      if (chapters[i].index >= lastIndex) {
        lastIndex = chapters[i].index;
      }
    }
  }
  //   console.log("Chapters: ", course);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div>There was an error fetching chapters!</div>;
  }

  //handlres
  // Handler to show the dialog
  const handleOpenModal = () => {
    const dialog = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  // Handler to close the dialog
  const handleCloseModal = () => {
    const dialog = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Chapters</h1>
          <p className="text-gray-600">
            Browse all available Chapters in this course
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleOpenModal} className="btn  btn-primary">
            Add Chapter
          </button>
          <button
            onClick={() =>
              navigate(`/semesters/${course?.data.semester_id}/courses`)
            }
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
            Back to Courses
          </button>
        </div>
      </div>

      {/* Dialog */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Course</h3>

          {/* Render the separate form component */}
          <CreateChapterForm
            newIndex={lastIndex + 1}
            onSuccess={handleCloseModal} // close on success
            onCancel={handleCloseModal} // close on cancel
            courseId={course?.data.id!}
          />
        </div>
      </dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chapters &&
          chapters.length > 0 &&
          chapters.map((chapter: Chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
      </div>
    </>
  );
};

export default ChaptersPage;
