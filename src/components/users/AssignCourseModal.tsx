// AssignCourseModal.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Course } from "../../types/courses";
import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import { Semester } from "../../types/semesters";
import axiosInstance from "../../lib/axios";
import useGetRelatedCourses from "../../hooks/useGetRelatedCourses";
import useGetUserCourses from "../../hooks/useGetUserCourses";
import { AxiosError } from "axios";

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

interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { data: allSemesters, error, isLoading } = useGetAllSemesters();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isSemesterLocked, setIsSemesterLocked] = useState<boolean>(true);
  const [isCourseLocked, setIsCourseLocked] = useState<boolean>(true);
  const [isAssigningSemester, setIsAssigningSemester] =
    useState<boolean>(false);
  const [isAssigningCourse, setIsAssigningCourse] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"assign" | "view">("assign");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCourseToToggle, setSelectedCourseToToggle] =
    useState<Course | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add this new function for handling course state toggle
  const handleToggleCourseLock = async () => {
    if (!selectedCourseToToggle) return;

    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(
        `user-course-progress/course/${selectedCourseToToggle.id}/user/${user.id}`,
        { is_locked: !selectedCourseToToggle.is_locked }
      );

      toast.success(
        `Course ${
          !selectedCourseToToggle.is_locked ? "locked" : "unlocked"
        } successfully!`
      );
      refetchUserCourses();
    } catch (error) {
      console.error("Error updating course lock status:", error);
      toast.error("Failed to update course status");
    } finally {
      setIsUpdating(false);
      setShowConfirmationModal(false);
      setSelectedCourseToToggle(null);
    }
  };

  // Fetch user's assigned courses
  const {
    data: userCoursesResponse,
    isLoading: userCoursesLoading,
    error: userCoursesError,
    refetch: refetchUserCourses,
  } = useGetUserCourses(user.id);

  // Fetch courses related to the selected semester
  const {
    data: coursesResponse,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetRelatedCourses(selectedSemester);

  const courses = coursesResponse?.data || [];
  const userCourses = userCoursesResponse?.data || [];

  // Separate locked and unlocked courses
  const unlockedCourses = userCourses.filter((course) => !course.is_locked);
  const lockedCourses = userCourses.filter((course) => course.is_locked);

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

  if (userCoursesError) {
    console.log("User courses error:", userCoursesError);
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
      // Refetch user courses to update the list
      refetchUserCourses();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 409) {
        toast.error("This semester is already assigned to this user");
      } else {
        console.error("Error assigning semester:", error);
        toast.error("Failed to assign semester");
      }
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
      // Refetch user courses to update the list
      refetchUserCourses();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 409) {
        toast.error("This course is already assigned to this user");
      } else {
        console.error("Error assigning course:", error);
        toast.error("Failed to assign course");
      }
    } finally {
      setIsAssigningCourse(false);
    }
  };

  // Update the renderCourseList function
  const renderCourseList = (courses: Course[], title: string) => {
    if (courses.length === 0) {
      return (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500 text-sm">
            No {title.toLowerCase()} courses found
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">
          {title} ({courses.length})
        </h4>
        <div className="bg-gray-50 rounded-md p-2 max-h-40 overflow-y-auto">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-2 border-b border-gray-200 last:border-b-0 flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {course.name_ar || course.name_en}
                </p>
                <p className="text-xs text-gray-500">
                  Semester:{" "}
                  {course.semester?.name_ar ||
                    course.semester?.name_en ||
                    "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {course.is_completed && (
                  <span className="badge badge-success">Completed</span>
                )}
                <button
                  className={`btn btn-xs ${
                    course.is_locked ? "btn-warning" : "btn-success"
                  }`}
                  onClick={() => {
                    setSelectedCourseToToggle(course);
                    setShowConfirmationModal(true);
                  }}
                  disabled={isUpdating}
                >
                  {course.is_locked ? "Unlock" : "Lock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Manage Content for {user.name}
        </h2>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-4">
          <button
            className={`tab ${activeTab === "assign" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("assign")}
          >
            Assign Content
          </button>
          <button
            className={`tab ${activeTab === "view" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            View Assigned Courses
          </button>
        </div>

        {activeTab === "assign" ? (
          <>
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

                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">Unlock Semester</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!isSemesterLocked}
                        onChange={() => setIsSemesterLocked(!isSemesterLocked)}
                      />
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

                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">Unlock Course</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!isCourseLocked}
                        onChange={() => setIsCourseLocked(!isCourseLocked)}
                      />
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
          </>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">User's Assigned Courses</h3>

            {userCoursesLoading ? (
              <div className="text-center py-4">Loading user courses...</div>
            ) : userCoursesError ? (
              <div className="text-center py-4 text-red-500">
                Error loading user courses
              </div>
            ) : (
              <div className="space-y-6">
                {renderCourseList(unlockedCourses, "Unlocked Courses")}
                {renderCourseList(lockedCourses, "Locked Courses")}

                {userCourses.length === 0 && (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      This user has no assigned courses yet
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-outline btn-sm w-full mt-4"
                  onClick={() => refetchUserCourses()}
                >
                  Refresh Course List
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
      {showConfirmationModal && selectedCourseToToggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
            <p>
              Are you sure you want to{" "}
              {selectedCourseToToggle.is_locked ? "unlock" : "lock"} this
              course?
            </p>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleToggleCourseLock}
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignCourseModal;
