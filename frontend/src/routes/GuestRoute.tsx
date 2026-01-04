import { Navigate, Outlet } from "react-router-dom";
import { backendApi } from "@/libs/apiInterface";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/commons/LoadingScreen";

export default function GuestRoute() {
  const accessToken = localStorage.getItem("token");

  // Default loading TRUE kalo ada token, FALSE kalo gak ada token (biar instan)
  const [isChecking, setIsChecking] = useState<boolean>(!!accessToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await backendApi.get("/users/me");

        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          throw new Error("Token Invalid");
        }
      } catch (error) {
        console.warn("Session expired or invalid, cleaning up...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [accessToken]);

  if (isChecking) {
    return <LoadingScreen text="Checking Session..." />;
  }

  if (isLoggedIn) {
    return <Navigate to="/app/dashboard" replace={true} />;
  }

  return <Outlet />;
}
