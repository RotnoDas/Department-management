import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-base-200 flex min-h-screen items-center justify-center">
        <Loading text="Authenticating..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Students and Teachers who are pending / rejected can only see those specific pages
  if (["student", "teacher"].includes(user.role) && user.status === "pending")
    return <Navigate to="/pending" replace />;
  if (["student", "teacher"].includes(user.role) && user.status === "rejected")
    return <Navigate to="/rejected" replace />;

  return children;
}
