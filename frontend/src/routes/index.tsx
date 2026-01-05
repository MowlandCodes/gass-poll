import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/404";
import Login from "@/pages/Login";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Register from "@/pages/Register";
import ClientLayout from "@/layouts/ClientLayout";
import AdminRoute from "./AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";

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
        element: <ClientLayout />,
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
  {
    path: "/admin",
    element: <AdminRoute />,
    errorElement: <NotFound />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <div>Dashboard Admin</div>,
          },
        ],
      },
    ],
  },
]);

export default router;
