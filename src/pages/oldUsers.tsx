// import React from "react";
// import { GridColDef } from "@mui/x-data-grid";
// import DataTable from "../components/oldDataTable";
// import { fetchUsers } from "../api/ApiCollection";
// import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import AddData from "../components/AddData";

// const Users = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const { isLoading, isError, isSuccess, data } = useQuery({
//     queryKey: ["allusers"],
//     queryFn: fetchUsers,
//   });

//   // console.log("userrs", data?.data?.data);

//   // Only access data.data.data if data exists
//   const usersArray = data?.data?.data || [];

//   const columns: GridColDef[] = [
//     // { field: "id", headerName: "ID", width: 90 },
//     {
//       field: "name",
//       headerName: "Name",
//       minWidth: 220,
//       flex: 1,
//       renderCell: (params) => {
//         return (
//           <div className="flex gap-3 items-center">
//             <div className="avatar">
//               <div className="w-6 xl:w-9 rounded-full">
//                 <img
//                   src={params.row.profile.avatar || "/Portrait_Placeholder.png"}
//                   alt="user-picture"
//                 />
//               </div>
//             </div>
//             <span className="mb-0 pb-0 leading-none">{params.row.name}</span>
//           </div>
//         );
//       },
//     },
//     {
//       field: "id",
//       type: "string",
//       headerName: "Id",
//       minWidth: 200,
//       flex: 1,
//     },
//     {
//       field: "email",
//       type: "string",
//       headerName: "Email",
//       minWidth: 200,
//       flex: 1,
//     },
//     {
//       field: "phone",
//       type: "string",
//       headerName: "Phone",
//       minWidth: 120,
//       flex: 1,
//     },
//     {
//       field: "created_at",
//       type: "string",
//       headerName: "created at",
//       minWidth: 120,
//       flex: 1,
//       valueFormatter: (params) => {
//         // Check if the value exists
//         if (!params.value) return "";

//         // Convert the ISO string to a Date object and format it
//         const date = new Date(params.value);
//         return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
//       },
//     },
//     // {
//     //   field: "createdAt",
//     //   headerName: "Created At",
//     //   minWidth: 100,
//     //   type: "string",
//     //   flex: 1,
//     // },
//     // {
//     //   field: 'fullName',
//     //   headerName: 'Full name',
//     //   description:
//     //     'This column has a value getter and is not sortable.',
//     //   sortable: false,
//     //   width: 160,
//     //   valueGetter: (params: GridValueGetterParams) =>
//     //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//     // },
//     // {
//     //   field: "verified",
//     //   headerName: "Verified",
//     //   width: 80,
//     //   type: "boolean",
//     //   flex: 1,
//     // },
//   ];

//   React.useEffect(() => {
//     if (isLoading) {
//       toast.loading("Loading...", { id: "promiseUsers" });
//     }
//     if (isError) {
//       toast.error("Error while getting the data!", {
//         id: "promiseUsers",
//       });
//     }
//     if (isSuccess) {
//       toast.success("Got the data successfully!", {
//         id: "promiseUsers",
//       });
//     }
//   }, [isError, isLoading, isSuccess]);

//   return (
//     <>
//       {usersArray && (
//         <div className="w-full p-0 m-0">
//           <div className="w-full flex flex-col items-stretch gap-3">
//             <div className="w-full flex justify-between mb-5">
//               <div className="flex gap-1 justify-start flex-col items-start">
//                 <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
//                   Users
//                 </h2>
//                 {data && usersArray.length > 0 && (
//                   <span className="text-neutral dark:text-neutral-content font-medium text-base">
//                     {usersArray.length} Users Found
//                   </span>
//                 )}
//               </div>
//               {/* <button
//                 onClick={() => setIsOpen(true)}
//                 className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
//               >
//                 Add New User +
//               </button> */}
//             </div>
//             {isLoading ? (
//               <DataTable
//                 slug="users"
//                 columns={columns}
//                 rows={[]}
//                 includeActionColumn={true}
//               />
//             ) : isSuccess ? (
//               <DataTable
//                 slug="users"
//                 columns={columns}
//                 rows={usersArray}
//                 includeActionColumn={true}
//               />
//             ) : (
//               <>
//                 <DataTable
//                   slug="users"
//                   columns={columns}
//                   rows={[]}
//                   includeActionColumn={true}
//                 />
//                 <div className="w-full flex justify-center">
//                   Error while getting the data!
//                 </div>
//               </>
//             )}

//             {isOpen && (
//               <AddData slug={"user"} isOpen={isOpen} setIsOpen={setIsOpen} />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Users;
