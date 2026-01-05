import { Navigate, Outlet, useLocation } from "react-router-dom";
import { backendApi } from "@/libs/apiInterface";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/commons/LoadingScreen";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: "user" | "admin";
}

export default function AdminRoute() {
  const location = useLocation();
  const accessToken = localStorage.getItem("token");

  // Default isLoading TRUE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const validateSession = async () => {
      if (!accessToken) {
        setIsLoading(false);
        setIsAdmin(false);
        return;
      }

      try {
        const response = await backendApi.get<IUser>("/users/me");

        if (response.status === 200 && response.data.role === "admin") {
          setIsAdmin(true);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        console.error("Session Integrity Check Failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [accessToken]);

  if (isLoading) {
    return <LoadingScreen text="Validating Session" />;
  }

  if (!isAdmin) {
    // If not admin return to Dashboard, and let the protected route handle the rest
    return <Navigate to="/app/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
