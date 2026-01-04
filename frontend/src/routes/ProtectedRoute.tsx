import { Navigate, Outlet, useLocation } from "react-router-dom";
import { backendApi } from "@/libs/apiInterface";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/commons/LoadingScreen";

export default function ProtectedRoute() {
  const location = useLocation();
  const accessToken = localStorage.getItem("token");

  // Default isLoading TRUE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const validateSession = async () => {
      if (!accessToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await backendApi.get("/users/me");

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        console.error("Session Integrity Check Failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [accessToken]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
