import React from "react";
import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import Loader from "../../components/Loader";
import SemesterCard from "../../components/semesters/SemesterCard";

// Import the new form component
import CreateSemesterForm from "../../components/semesters/CreateSemesterForm";

const SemestersPage = () => {
  const { data: allSemesters, error, isLoading } = useGetAllSemesters();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div>There was an error fetching semesters!</div>;
  }

  // Handler to show the dialog
  const handleOpenModal = () => {
    const dialog = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  // Handler to close the dialog
  const handleCloseModal = () => {
    const dialog = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Semesters Page</h1>

        {/* Add new semester (open modal) */}
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Add New Semester
        </button>
      </div>

      {/* Dialog */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Semester</h3>

          {/* Render the separate form component */}
          <CreateSemesterForm
            onSuccess={handleCloseModal} // close on success
            onCancel={handleCloseModal} // close on cancel
          />
        </div>
      </dialog>

      {/* Render existing semesters */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6 justify-items-center">
        {allSemesters?.map((semester) => (
          <SemesterCard
            semester={semester}
            key={semester.id}
            created_at={semester.created_at}
            description_ar={semester.description_ar}
            id={semester.id}
            image_url_ar={semester.image_url_ar}
            name_ar={semester.name_ar}
            price={semester.price}
            slug={semester.slug}
          />
        ))}
      </div>
    </>
  );
};

export default SemestersPage;
