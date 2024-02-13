import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: any }) => {
  let token = localStorage.getItem("uid");
  if (token === null) return <Navigate to="/login" />;
  return children;
};
