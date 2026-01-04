import { Navigate, Outlet, useLocation } from "react-router-dom";
import { backendApi } from "@/libs/apiInterface";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const accessToken = localStorage.getItem("token");
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const getProfile = async () => {
      const response = await backendApi.get("/users/me");

      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    };

    getProfile();
  }, []);

  if (!accessToken && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return <Outlet />;
}
