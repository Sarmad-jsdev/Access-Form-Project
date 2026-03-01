import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // wait until auth state is ready
  if (!user) return <Navigate to="/login" />; // redirect if not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // optional role check

  return children;
};

export default ProtectedRoute;