import { useParams } from "react-router-dom";
import useGetAnswersQuestionById from "../../hooks/useGetAnswersQuestionById";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserAnswer } from "../../types/Assigments";

const AssigmentAnswersPage = () => {
  const params = useParams();
  const {
    data: answers,
    isError,
    error,
    isLoading,
  } = useGetAnswersQuestionById({
    questionId: params.questionId as string,
  });

  console.log("answers is", answers);

  interface CellContext<T> {
    getValue: () => any;
  }

  const columns: ColumnDef<UserAnswer>[] = [
    {
      accessorKey: "answer",
      header: "answer",
      cell: (info: CellContext<UserAnswer>) => {
        return (
          <p
            style={{
              scrollbarWidth: "none",
            }}
            className="max-w-[300px] overflow-scroll"
          >
            {info.getValue()}
          </p>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: (info: CellContext<UserAnswer>) =>
        new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  const table = useReactTable({
    data: answers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    console.log(error);

    return <div>Error</div>;
  }
  if (!answers) {
    return <div>No answers found</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">AssigmentAnswersPage</h1>

      {/* here should go tanstack table to show the anwers of the question */}
      <div className="overflow-x-auto">
        {answers && answers.length > 0 ? (
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
              No answers available for this chapter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssigmentAnswersPage;
