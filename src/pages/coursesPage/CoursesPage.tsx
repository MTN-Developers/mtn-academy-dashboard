// pages/courses/CoursesPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import useGetRelatedCourses from "../../hooks/useGetRelatedCourses";
import Loader from "../../components/Loader";
import CreateCourseForm from "../../components/courses/CreateCourseForm";
import { useState } from "react";
import CoursesTable from "../../components/courses/CourseTable";

const CoursesPage = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useGetRelatedCourses(semesterId!);
  const courses = coursesResponse?.data || [];

  const lastIndex = courses.reduce(
    (max, course) => (course.index > max ? course.index : max),
    0
  );

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>Error loading courses!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Semester Courses</h1>
          <p className="text-gray-600">
            Browse all available courses in this semester
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Add Course
          </button>
          <button
            onClick={() => navigate("/semesters")}
            className="btn btn-outline btn-primary"
          >
            Back to Semesters
          </button>
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
            <CreateCourseForm
              newIndex={lastIndex + 1}
              onCancel={() => setCreateModalOpen(false)}
              onSuccess={() => setCreateModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Courses Table */}
      {courses.length === 0 ? (
        <div className="card bg-base-200 p-8 text-center mt-6">
          <h2 className="card-title text-xl mb-2">No Courses Found</h2>
          <p className="text-gray-600">
            This semester doesn't have any courses yet.
          </p>
        </div>
      ) : (
        <CoursesTable courses={courses} />
      )}
    </div>
  );
};

export default CoursesPage;
