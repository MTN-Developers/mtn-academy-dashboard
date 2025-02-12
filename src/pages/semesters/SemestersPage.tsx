import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import Loader from "../../components/Loader";
import SemesterCard from "../../components/semesters/SemesterCard";

const SemestersPage = () => {
  const { data: allSemesters, error, isLoading } = useGetAllSemesters();

  console.log(allSemesters);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>There was an error fetching semesters!</div>;
  }

  return (
    <>
      <h1 className="text-xl text-gray-700 font-semibold my-4">
        Semesters page
      </h1>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 justify-items-center">
        {allSemesters?.map((semester) => (
          <SemesterCard
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
