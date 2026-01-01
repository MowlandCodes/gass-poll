import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
  },
]);

export default router;
