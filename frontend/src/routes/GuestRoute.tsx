import { Navigate, Outlet } from "react-router-dom";
import { backendApi } from "@/libs/apiInterface";
import { useState, useEffect } from "react";

export default function GuestRoute() {
  const accessToken = localStorage.getItem("token");
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

  if (accessToken && isLoggedIn) {
    return <Navigate to="/app/dashboard" replace={true} />;
  }

  return <Outlet />;
}
