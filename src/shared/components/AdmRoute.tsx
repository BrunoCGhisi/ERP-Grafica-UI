import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken } from "../services"; // Serviço para obter e decodificar o token

const AdmRoute = ({ children }: { children: JSX.Element }) => {
  const [isAdm, setIsAdm] = useState<boolean>(); // Estado para armazenar o valor de isAdm
  const [loading, setLoading] = useState<boolean>(true); // Estado para verificar o carregamento do token

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken(); // Obtemos o token
      if (tokenData) {
        setIsAdm(tokenData.isAdm === true); // Converte o valor para booleano
      }
      setLoading(false);
    };

    fetchToken();
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Exibe algo enquanto o token está sendo carregado
  }

  if (!isAdm) {
    // Se não for admin, redireciona para login ou outra página de acesso negado
    return <Navigate to="/dashboard" />;
  }

  return children; // Se é admin, renderiza as rotas protegidas
};

export default AdmRoute;
