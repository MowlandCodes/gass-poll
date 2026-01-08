import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/404";
import Login from "@/pages/Login";
<<<<<<< HEAD
=======
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Register from "@/pages/Register";
import ClientLayout from "@/layouts/ClientLayout";
import AdminRoute from "./AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientTransactions from "@/pages/ClientTransaction";
>>>>>>> 3888ef5ce9b1f3ca75f365121581dfa711c8969b

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
      {
        path: "login",
        element: <Login />,
      },
<<<<<<< HEAD
=======
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
            element: <div>Dashboard Admin</div>,
          },
        ],
      },
>>>>>>> 3888ef5ce9b1f3ca75f365121581dfa711c8969b
    ],
  },
]);

export default router;
