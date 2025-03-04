// src/pages/VideosPage/VideosPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useGetCourseBySlug from "../../hooks/useGetCourseBySlug";
import Loader from "../../components/Loader";
import { Video } from "../../types/courses";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import EditVideoForm from "../../components/videos/EditVideoForm";
import CreateVideoForm from "../../components/videos/CreateVideoForm";

const VideosPage = () => {
  const { courseSlug, chapterId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const {
    data: courseResponse,
    isLoading,
    error,
  } = useGetCourseBySlug(courseSlug!);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
    return <div>There was an error fetching videos!</div>;
  }

  if (!courseResponse || !courseResponse.data) {
    return <div>Course not found</div>;
  }

  const course = courseResponse.data;

  // Find the current chapter
  const currentChapter = course.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  if (!currentChapter) {
    return <div>Chapter not found</div>;
  }

  const videos = currentChapter.videos || [];

  //   console.log("vidos", videos);

  // Calculate the next index for a new video
  const nextVideoIndex =
    videos.length > 0 ? Math.max(...videos.map((video) => video.index)) + 1 : 0;

  // Handle opening modals
  const handleOpenEditModal = (video: Video) => {
    setVideoToEdit(video);
    const dialog = document.getElementById(
      "edit_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      "edit_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
    setVideoToEdit(null);
  };

  const handleOpenDeleteModal = (video: Video) => {
    setVideoToDelete(video);
    const dialog = document.getElementById(
      "delete_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseDeleteModal = () => {
    const dialog = document.getElementById(
      "delete_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
    setVideoToDelete(null);
  };

  const handleOpenCreateModal = () => {
    const dialog = document.getElementById(
      "create_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseCreateModal = () => {
    const dialog = document.getElementById(
      "create_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  // Handle delete video
  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      await axiosInstance.delete(`/video/${videoToDelete.id}`);
      toast.success("Video deleted successfully");

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["course-by-slug", courseSlug],
      });

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  // Table column definition
  const columnHelper = createColumnHelper<Video>();

  const columns = [
    columnHelper.accessor("index", {
      header: "Index",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title_ar", {
      header: "Arabic Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title_en", {
      header: "English Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("duration", {
      header: "Duration (ms)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("video_url", {
      header: "Video URL",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline truncate block max-w-xs"
          >
            {url}
          </a>
        ) : (
          <span className="text-gray-400">No URL</span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEditModal(props.row.original)}
            className="btn btn-xs btn-success"
          >
            Edit
          </button>
          <button
            onClick={() => handleOpenDeleteModal(props.row.original)}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-gray-600">
            Manage videos for chapter: {currentChapter.title_ar}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            Add Video
          </button>
          <button
            onClick={() =>
              navigate(
                `/semesters/${course.semester_id}/courses/${courseSlug}/chapters`
              )
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
            Back to Chapters
          </button>
        </div>
      </div>

      {/* Videos Table */}
      <div className="overflow-x-auto">
        {videos.length > 0 ? (
          <table className="table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No videos available for this chapter.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="btn btn-primary mt-4"
            >
              Add your first video
            </button>
          </div>
        )}
      </div>

      {/* Edit Video Modal */}
      <dialog id="edit_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Video</h3>
          {videoToEdit && (
            <EditVideoForm
              video={videoToEdit}
              chapterId={chapterId!}
              onSuccess={handleCloseEditModal}
              onCancel={handleCloseEditModal}
            />
          )}
        </div>
      </dialog>

      {/* Create Video Modal */}
      <dialog id="create_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Video</h3>
          <CreateVideoForm
            chapterId={chapterId!}
            nextIndex={nextVideoIndex}
            onSuccess={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
          />
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete the video "{videoToDelete?.title_ar}
            "? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button onClick={handleDeleteVideo} className="btn btn-error">
              Delete
            </button>
            <button onClick={handleCloseDeleteModal} className="btn">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default VideosPage;
