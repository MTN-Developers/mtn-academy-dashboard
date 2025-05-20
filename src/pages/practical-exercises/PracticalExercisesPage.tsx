import { useParams } from "react-router-dom";
import useGetPracticalExVideos from "../../hooks/useGetPracticalExVideos";
// import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Video } from "../../types/practicalChapter";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditVideoForm from "../../components/videos/EditVideoForm";
import CreateVideoForm from "../../components/videos/CreateVideoForm";

const PracticalExercisesPage = () => {
  const { courseId } = useParams();
  // const queryClient = useQueryClient();
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const { data, isError, error, isLoading } = useGetPracticalExVideos({
    courseId: courseId as string,
  });

  const videos = data?.data?.[0]?.videos || [];

  //   console.log("Videos: ", videos);

  // Handle opening modals
  const handleOpenEditModal = (video: Video) => {
    setVideoToEdit(video);
    const dialog = document.getElementById(
      "edit_practical_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseEditModal = () => {
    const dialog = document.getElementById(
      "edit_practical_video_modal"
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
      "create_practical_video_modal"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const handleCloseCreateModal = () => {
    const dialog = document.getElementById(
      "create_practical_video_modal"
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
      //   queryClient.invalidateQueries({
      //     queryKey: ["course-by-slug", courseSlug],
      //   });

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

  // Calculate the next index for a new video
  const nextVideoIndex =
    videos.length > 0 ? Math.max(...videos.map((video) => video.index)) + 1 : 0;

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error(error);

    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <p className="text-gray-600">Practical Exercises:</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            Add Video
          </button>
        </div>
      </div>

      {videos.length > 0 ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}

      {/* Edit Video Modal */}
      <dialog id="edit_practical_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Video</h3>
          {videoToEdit && (
            <EditVideoForm
              video={videoToEdit}
              chapterId={data?.data?.[0]?.id!}
              onSuccess={handleCloseEditModal}
              onCancel={handleCloseEditModal}
              courseId={courseId!}
            />
          )}
        </div>
      </dialog>

      {/* Create Video Modal */}
      <dialog id="create_practical_video_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Video</h3>
          <CreateVideoForm
            chapterId={data?.data?.[0]?.id!}
            nextIndex={nextVideoIndex}
            onSuccess={handleCloseCreateModal}
            onCancel={handleCloseCreateModal}
            courseId={courseId!}
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

export default PracticalExercisesPage;
