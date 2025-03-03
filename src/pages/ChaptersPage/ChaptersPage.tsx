import { useParams } from "react-router-dom";
import useGetCourseBySlug from "../../hooks/useGetCourseBySlug";
import Loader from "../../components/Loader";
import { Chapter } from "../../types/courses";
import ChapterCard from "../../components/chapters/ChapterCard";

const ChaptersPage = () => {
  const { courseSlug } = useParams();

  const { data: course, isLoading, error } = useGetCourseBySlug(courseSlug!);

  const chapters = course?.data.chapters;
  console.log("Chapters: ", course);

  //   console.log("Chapters: ", course);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div>There was an error fetching chapters!</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {chapters &&
        chapters.length > 0 &&
        chapters.map((chapter: Chapter) => <ChapterCard chapter={chapter} />)}
    </div>
  );
};

export default ChaptersPage;
