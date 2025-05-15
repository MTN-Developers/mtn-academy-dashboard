import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/menu/Menu";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Posts from "./pages/Posts";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import Charts from "./pages/Charts";
import Logs from "./pages/Logs";
import ToasterProvider from "./components/ToasterProvider";
import EditProfile from "./pages/EditProfile";
import User from "./pages/User";
import Product from "./pages/Product";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import SemestersPage from "./pages/semesters/SemestersPage";
import CoursesPage from "./pages/coursesPage/CoursesPage";
import ChaptersPage from "./pages/ChaptersPage/ChaptersPage";
import VideosPage from "./pages/videosPage/VideosPage";
import EventsPage from "./pages/events/EventsPage";
import MaterialsPage from "./pages/materials/MaterialsPage";
import VideoAssigmentPage from "./pages/video-assigment/VideoAssigmentPage";
import AssigmentAnswersPage from "./pages/video-assigment/AssigmentAnswersPage";
import PracticalExercisesPage from "./pages/practical-exercises/PracticalExercisesPage";
import FreeStudiesPage from "./pages/freeStudies/FreeStudiesPage";
import FreeStudyChapterPage from "./pages/freeStudies/FreeStudyChapterPage";
import FreeStudyVideosPage from "./pages/freeStudies/FreeStudyVideosPage";
import CourseRequestsPage from "./pages/CourseRequest/CourseRequestPage";

function App() {
  const Layout = () => {
    return (
      <div
        id="rootContainer"
        className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
      >
        <ToasterProvider />
        <ScrollRestoration />
        <div>
          <Navbar />
          <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
            <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
              <Menu />
            </div>
            <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute requiredModule="user" requiredAction="read">
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/edit",
          element: (
            <ProtectedRoute requiredModule="user" requiredAction="read">
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: "/events",
          element: (
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users/:id",
          element: (
            <ProtectedRoute requiredModule="user" requiredAction="read">
              <User />
            </ProtectedRoute>
          ),
        },
        {
          path: "/products",
          element: (
            <ProtectedRoute requiredModule="product" requiredAction="read">
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "/products/:id",
          element: (
            <ProtectedRoute requiredModule="product" requiredAction="read">
              <Product />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute requiredModule="order" requiredAction="read">
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/posts",
          element: (
            <ProtectedRoute requiredModule="post" requiredAction="read">
              <Posts />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notes",
          element: (
            <ProtectedRoute requiredModule="note" requiredAction="read">
              <Notes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/calendar",
          element: (
            <ProtectedRoute requiredModule="calendar" requiredAction="read">
              <Calendar />
            </ProtectedRoute>
          ),
        },
        {
          path: "/charts",
          element: (
            <ProtectedRoute requiredModule="chart" requiredAction="read">
              <Charts />
            </ProtectedRoute>
          ),
        },
        {
          path: "/logs",
          element: (
            <ProtectedRoute requiredModule="log" requiredAction="read">
              <Logs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters",
          element: (
            <ProtectedRoute>
              <SemestersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses",
          element: (
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseSlug/chapters",
          element: (
            <ProtectedRoute>
              <ChaptersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseId/parcticalExercises",
          element: (
            <ProtectedRoute>
              <PracticalExercisesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseId/materials",
          element: (
            <ProtectedRoute>
              <MaterialsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseSlug/chapters/:chapterId/videos",
          element: (
            <ProtectedRoute>
              <VideosPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseSlug/chapters/:chapterId/videos/:videoId/assignments",
          element: (
            <ProtectedRoute>
              <VideoAssigmentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/semesters/:semesterId/courses/:courseSlug/chapters/:chapterId/videos/:videoId/assignments/answers/:questionId",
          element: (
            <ProtectedRoute>
              <AssigmentAnswersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/freestudy",
          element: (
            <ProtectedRoute>
              <FreeStudiesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/freestudy/:slug/chapters",
          element: (
            <ProtectedRoute>
              <FreeStudyChapterPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/requests",
          element: (
            <ProtectedRoute>
              <CourseRequestsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/freestudy/:slug/chapters/:chapterId/videos",
          element: (
            <ProtectedRoute>
              <FreeStudyVideosPage />
            </ProtectedRoute>
          ),
        },
      ],
      errorElement: <Error />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
  ]);

  return (
    <>
      <ToasterProvider />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
