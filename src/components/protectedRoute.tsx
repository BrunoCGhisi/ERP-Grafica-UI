import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Se não há token, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  // Se há token, renderiza a rota protegida
  return children;
};

export default ProtectedRoute;
