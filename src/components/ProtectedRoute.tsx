// components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  requiredAction?: "create" | "read" | "update" | "delete";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredModule,
  requiredAction = "read",
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredModule && !hasPermission(requiredModule, requiredAction)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
