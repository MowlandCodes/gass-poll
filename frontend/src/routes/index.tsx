import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/404";
import Login from "@/pages/Login";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Register from "@/pages/Register";
import ClientLayout from "@/layouts/ClientLayout";
import AdminRoute from "@/routes/AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientTransactions from "@/pages/ClientTransaction";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageMotors from "@/pages/admin/ManageMotors";
import ManageUsers from "@/pages/admin/ManageUsers";
import About from "@/pages/About";

const routerConfig: RouteObject[] = [
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
      {
        path: "about",
        element: <About />,
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
            element: <ClientDashboard />,
          },
          {
            path: "transactions",
            element: <ClientTransactions />,
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
            element: <AdminDashboard />,
          },
          {
            path: "motors",
            element: <ManageMotors />,
          },
          {
            path: "users",
            element: <ManageUsers />,
          },
        ],
      },
    ],
  },
];

export default createBrowserRouter(routerConfig);
