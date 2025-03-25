// src/pages/MaterialsPage.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetRelatedMaterials from "../../hooks/useGetRelatedMaterials";
import Loader from "../../components/Loader";
import MaterialsTable from "../../components/materials/MaterialsTable.js";
import AddMaterialModal from "../../components/materials/AddMaterialModal.js";

const MaterialsPage = () => {
  const { courseId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    data: relatedMaterials,
    isError,
    error,
    isLoading,
  } = useGetRelatedMaterials({
    courseId: courseId || "",
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.log("Error fetching related materials: ", error);
    return <div>Error fetching related materials</div>;
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Course Materials</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          Add New Material
        </button>
      </div>

      <MaterialsTable materials={relatedMaterials || []} />

      {courseId && (
        <AddMaterialModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default MaterialsPage;
