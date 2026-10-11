
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(savedUser);

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}