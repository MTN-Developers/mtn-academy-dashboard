// src/pages/VideosPage/VideosPage.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useGetCourseBySlug from "../../hooks/useGetCourseBySlug";
import axiosInstance from "../../lib/axios";
import Loader from "../../components/Loader";
import EditVideoForm from "../../components/videos/EditVideoForm";
import CreateVideoForm from "../../components/videos/CreateVideoForm";
import { Video } from "../../types/courses";

const columnHelper = createColumnHelper<Video>();

const FreeStudyVideosPage = () => {
  /* ------------- hooks that MUST always run, in the same order ------------- */
  const { slug = "", chapterId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const {
    data: courseResponse,
    isLoading,
    error: fetchError,
  } = useGetCourseBySlug(slug);

  /* --------------------------- derive safe data --------------------------- */
  const course = courseResponse?.data ?? null;
  const currentChapter =
    course?.chapters.find((c) => c.id === chapterId) ?? null;
  const videos: Video[] = currentChapter?.videos ?? [];

  const nextVideoIndex = videos.length
    ? Math.max(...videos.map((v) => v.index)) + 1
    : 0;

  /* --------------------------- table definition --------------------------- */
  const columns = useMemo(
    () => [
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
            <Link
              to={`/semesters/${course?.semester_id}/courses/${slug}/chapters/${chapterId}/videos/${props.row.original.id}/assignments`}
            >
              <button className="btn btn-xs btn-primary">Assignments</button>
            </Link>
            <button
              onClick={() => handleOpenDeleteModal(props.row.original)}
              className="btn btn-xs btn-error"
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    [chapterId, course?.semester_id, slug]
  );

  const table = useReactTable({
    data: videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* --------------------------- modal handlers --------------------------- */
  const handleOpenEditModal = (video: Video) => {
    setVideoToEdit(video);
    (
      document.getElementById("edit_video_modal") as HTMLDialogElement
    )?.showModal();
  };
  const handleCloseEditModal = () => {
    (document.getElementById("edit_video_modal") as HTMLDialogElement)?.close();
    setVideoToEdit(null);
  };

  const handleOpenDeleteModal = (video: Video) => {
    setVideoToDelete(video);
    (
      document.getElementById("delete_video_modal") as HTMLDialogElement
    )?.showModal();
  };
  const handleCloseDeleteModal = () => {
    (
      document.getElementById("delete_video_modal") as HTMLDialogElement
    )?.close();
    setVideoToDelete(null);
  };

  const handleOpenCreateModal = () => {
    (
      document.getElementById("create_video_modal") as HTMLDialogElement
    )?.showModal();
  };
  const handleCloseCreateModal = () => {
    (
      document.getElementById("create_video_modal") as HTMLDialogElement
    )?.close();
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    try {
      await axiosInstance.delete(`/video/${videoToDelete.id}`);
      toast.success("Video deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["course-by-slug", slug] });
      handleCloseDeleteModal();
    } catch (err) {
      toast.error("Failed to delete video");
      console.error(err);
    }
  };

  /* ------------------------------ rendering ------------------------------ */
  return (
    <div className="container mx-auto p-4">
      {/* Loading / error states */}
      {isLoading && <Loader />}
      {fetchError && !isLoading && (
        <div className="text-error">There was an error fetching videos!</div>
      )}
      {!isLoading && !fetchError && !course && <div>Course not found.</div>}
      {!isLoading && !fetchError && course && !currentChapter && (
        <div>Chapter not found.</div>
      )}

      {/* Only render the table when the course & chapter exist */}
      {course && currentChapter && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="space-y-2 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Videos</h1>
              <p className="text-gray-600">
                Manage videos for chapter: {currentChapter.title_ar}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleOpenCreateModal}
                className="btn btn-primary"
              >
                Add Video
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/semesters/${course.semester_id}/courses/${slug}/chapters`
                  )
                }
                className="btn btn-outline btn-primary"
              >
                ← Back to Chapters
              </button>
            </div>
          </div>

          {/* Videos table */}
          <div className="overflow-x-auto">
            {videos.length ? (
              <table className="table w-full">
                <thead>
                  {table.getHeaderGroups().map((group) => (
                    <tr key={group.id}>
                      {group.headers.map((header) => (
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
        </>
      )}

      {/* --------- Modals (identical to your originals) --------- */}
      <dialog id="edit_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Video</h3>
          {videoToEdit && (
            <EditVideoForm
              video={videoToEdit}
              chapterId={chapterId}
              onSuccess={handleCloseEditModal}
              onCancel={handleCloseEditModal}
              courseId={course?.id}
            />
          )}
        </div>
      </dialog>

      <dialog id="create_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Video</h3>
          <CreateVideoForm
            chapterId={chapterId}
            nextIndex={nextVideoIndex}
            onSuccess={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
            courseId={course?.id}
          />
        </div>
      </dialog>

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

export default FreeStudyVideosPage;
