import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
]);

export default router;
