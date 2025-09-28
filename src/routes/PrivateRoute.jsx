import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem("token"); //useAuth();
  return user ? children : <Navigate to="/" />;
}
