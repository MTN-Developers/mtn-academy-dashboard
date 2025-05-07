// import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import Loader from "../../components/Loader";
// import SemesterCard from "../../components/semesters/SemesterCard";

// Import the new form component
// import CreateSemesterForm from "../../components/semesters/CreateSemesterForm";
import useGetAllFreeStudies from "../../hooks/freeStudies/useGetAllGetFreeStudies";
import FreeStudyCard from "../../components/freeStudies/FreeStudyCard";
import CreateFreeStudyForm from "./CreateFreeStudyForm";

const FreeStudiesPage = () => {
  const {
    data: allFreeStudiesResponse,
    error,
    isLoading,
  } = useGetAllFreeStudies({ limit: 1000, page: 1 });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div>There was an error fetching semesters!</div>;
  }

  const allFreeStudies = allFreeStudiesResponse?.data.data;

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
        <h1 className="text-xl font-semibold my-4">Free Studies Page</h1>

        {/* Add new semester (open modal) */}
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Add New Free Study
        </button>
      </div>

      {/* Dialog */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Free Study</h3>

          {/* Render the separate form component */}
          <CreateFreeStudyForm
            onSuccess={handleCloseModal} // close on success
            onCancel={handleCloseModal} // close on cancel
          />
        </div>
      </dialog>

      {/* Render existing semesters */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6 justify-items-center">
        {allFreeStudies?.map((study) => (
          <FreeStudyCard
            study={study}
            key={study.id}
            created_at={study.created_at}
            description_ar={study.description_ar || ""}
            id={study.id}
            image_url_ar={study.logo_ar || ""}
            name_ar={study.name_ar}
            price={study.price || 0}
            slug={study.slug}
          />
        ))}
      </div>
    </>
  );
};

export default FreeStudiesPage;
