// AssignCourseModal.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Course } from "../../types/courses";
import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import { Semester } from "../../types/semesters";
import axiosInstance from "../../lib/axios";
import useGetRelatedCourses from "../../hooks/useGetRelatedCourses";

interface UserData {
  id: string | number;
  name: string;
  email: string;
  assignedCourses?: Course[];
  [key: string]: any; // For other properties
}

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { data: allSemesters, error, isLoading } = useGetAllSemesters();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isSemesterLocked, setIsSemesterLocked] = useState<boolean>(false);
  const [isCourseLocked, setIsCourseLocked] = useState<boolean>(false);
  const [isAssigningSemester, setIsAssigningSemester] =
    useState<boolean>(false);
  const [isAssigningCourse, setIsAssigningCourse] = useState<boolean>(false);

  // Fetch courses related to the selected semester
  const {
    data: coursesResponse,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetRelatedCourses(selectedSemester);

  const courses = coursesResponse?.data || [];

  // Reset selected course when semester changes
  useEffect(() => {
    setSelectedCourse("");
  }, [selectedSemester]);

  if (error) {
    console.log("Semester error:", error);
  }

  if (coursesError) {
    console.log("Courses error:", coursesError);
  }

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const handleAssignSemester = async () => {
    if (!selectedSemester) {
      toast.error("Please select a semester first");
      return;
    }

    setIsAssigningSemester(true);
    try {
      const response = await axiosInstance.post("/user-semester-progress/", {
        user_id: user.id,
        semester_id: selectedSemester,
        is_locked: isSemesterLocked,
      });

      toast.success("Semester assigned successfully!");
      console.log("Semester assignment response:", response.data);
    } catch (error) {
      console.error("Error assigning semester:", error);
      toast.error("Failed to assign semester");
    } finally {
      setIsAssigningSemester(false);
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course first");
      return;
    }

    setIsAssigningCourse(true);
    try {
      const response = await axiosInstance.post("/user-course-progress", {
        user_id: user.id,
        course_id: selectedCourse,
        is_locked: isCourseLocked,
      });

      toast.success("Course assigned successfully!");
      console.log("Course assignment response:", response.data);
    } catch (error) {
      console.error("Error assigning course:", error);
      toast.error("Failed to assign course");
    } finally {
      setIsAssigningCourse(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Assign Content to {user.name}
        </h2>

        {/* Semester Assignment Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Assign Semester</h3>

          {isLoading ? (
            <div className="text-center py-4">Loading semesters...</div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="semester-select"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Semester
                </label>
                <select
                  id="semester-select"
                  className="select select-bordered w-full"
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                >
                  <option value="" disabled>
                    Choose Semester
                  </option>

                  {allSemesters && allSemesters.length > 0 ? (
                    allSemesters.map((semester: Semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name_ar}
                      </option>
                    ))
                  ) : (
                    <option disabled>No semesters available</option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lock-semester"
                  checked={isSemesterLocked}
                  onChange={() => setIsSemesterLocked(!isSemesterLocked)}
                  className="checkbox"
                />
                <label
                  htmlFor="lock-semester"
                  className="text-sm text-gray-700"
                >
                  Lock semester
                </label>
              </div>

              <button
                onClick={handleAssignSemester}
                className="btn btn-secondary w-full"
                disabled={!selectedSemester || isAssigningSemester}
              >
                {isAssigningSemester ? "Assigning..." : "Assign Semester"}
              </button>
            </>
          )}
        </div>

        {/* Course Assignment Section */}
        <div className="border-t border-gray-200 my-4 pt-4 space-y-4">
          <h3 className="text-lg font-medium">Assign Course</h3>

          {!selectedSemester ? (
            <div className="text-sm text-gray-500 italic">
              Please select a semester first to view available courses
            </div>
          ) : coursesLoading ? (
            <div className="text-center py-4">Loading courses...</div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="course-select"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Course
                </label>
                <select
                  id="course-select"
                  className="select select-bordered w-full"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  disabled={!selectedSemester || coursesLoading}
                >
                  <option value="" disabled>
                    Choose Course
                  </option>

                  {courses && courses.length > 0 ? (
                    courses.map((course: Course) => (
                      <option key={course.id} value={course.id}>
                        {course.name_ar || course.name_en}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      No courses available for this semester
                    </option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lock-course"
                  checked={isCourseLocked}
                  onChange={() => setIsCourseLocked(!isCourseLocked)}
                  className="checkbox"
                />
                <label htmlFor="lock-course" className="text-sm text-gray-700">
                  Lock course
                </label>
              </div>

              <button
                onClick={handleAssignCourse}
                className="btn btn-secondary w-full"
                disabled={!selectedCourse || isAssigningCourse}
              >
                {isAssigningCourse ? "Assigning..." : "Assign Course"}
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignCourseModal;
