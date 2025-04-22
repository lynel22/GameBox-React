import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = localStorage.getItem("token");

  console.log("Token from localStorage:", token);
  console.log("Redirecting to login, token:", token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
