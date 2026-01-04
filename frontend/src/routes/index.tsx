import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/404";
import Login from "@/pages/Login";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Register from "@/pages/Register";
import ClientLayout from "@/layouts/ClientLayout";

const router = createBrowserRouter([
  // Landing Page
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
  // Login & Register
  {
    element: <GuestRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  // Main App
  {
    path: "/app",
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      {
        element: <ClientLayout />, // Masih pake Layout utama
        children: [
          {
            path: "dashboard",
            element: <div>Dashboard Page</div>,
          },
          {
            path: "profile",
            element: <div>Profile User</div>,
          },
        ],
      },
    ],
  },
]);

export default router;
