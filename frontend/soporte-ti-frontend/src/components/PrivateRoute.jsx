import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // evita redirección prematura
  if (!user) return <Navigate to="/" />;

  return children;
}
