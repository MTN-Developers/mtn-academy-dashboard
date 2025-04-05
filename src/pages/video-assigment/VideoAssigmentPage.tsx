import { Link, useParams } from "react-router-dom";
import useGetVideoById from "../../hooks/useGetVideoById";
import CreateAssigmentForm from "../../components/videos/CreateAssigmentForm";
import useGetQuestionsByVideoId from "../../hooks/useGetQuestionsByVideoId";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const VideoAssigmentPage = () => {
  const params = useParams();
  const {
    data: video,
    isError,
    error,
    isLoading,
  } = useGetVideoById({
    id: params.videoId as string,
  });

  const { data: questions } = useGetQuestionsByVideoId({
    videoId: params.videoId as string,
  });

  interface Question {
    question: string;
    created_at: string;
    id: string;
  }

  interface ColumnDef<T> {
    accessorKey: keyof T;
    header: string;
    cell: (info: CellContext<T>) => JSX.Element | string;
  }

  interface CellContext<T> {
    getValue: () => any;
  }

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: (info: CellContext<Question>) => info.getValue(),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: (info: CellContext<Question>) =>
        new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (info: CellContext<Question>) => {
        const questionId = info.getValue();

        return (
          <>
            <Link
              to={`/semesters/${params.semesterId}/courses/${params.courseSlug}/chapters/${params.chapterId}/videos/${params.videoId}/assignments/answers/${questionId}`}
            >
              <button className="btn btn-sm btn-success">
                See users answers
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: questions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error("Error fetching video:", error);
    return <div>Error fetching video</div>;
  }
  if (!video) return <div>Video not found</div>;

  //   console.log("Video Assignment Page Data:", video);

  // ## handlers

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

  return (
    <>
      <div className="flex justify-between  items-center">
        <h1 className="text-2xl font-bold  my-2">Video Assignment Page</h1>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          Add Assigment
        </button>
      </div>
      {video && (
        <div className="my-4">
          <h1 className="mb-4">
            Video title : {video.title_ar} - {video.title_en}
          </h1>
          {/* here should go the questions related to this video tanstack table  */}
          <div className="overflow-x-auto">
            {questions && questions.length > 0 ? (
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

          {/* Create Video Modal */}
          <dialog id="create_video_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add New Assigment</h3>
              <CreateAssigmentForm
                videoId={params.videoId as string}
                onSuccess={handleCloseCreateModal}
                onCancel={handleCloseCreateModal}
              />
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};

export default VideoAssigmentPage;
