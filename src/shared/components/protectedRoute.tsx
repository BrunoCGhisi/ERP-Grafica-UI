import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');

  if (!token) { 
    return <Navigate to="/dashboard" />;
  }

  // Se há token, renderiza a rota protegida
  return children;
};

export default ProtectedRoute;
