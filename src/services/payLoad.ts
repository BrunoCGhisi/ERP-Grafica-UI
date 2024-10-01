import { jwtDecode } from 'jwt-decode'; // Importação correta do jwt-decode
import { PayLoadVO } from './types'; // Importa o tipo

export async function getToken(): Promise<PayLoadVO | null> {
  try {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage
    if (token) {
      const decodedToken = jwtDecode<PayLoadVO>(token); // Decodifica o token com o tipo específico
      return decodedToken; // Retorna o token decodificado
    }
  } catch (error) {
    console.log('Erro ao obter o token:', error);
  }
  return null; // Retorna null se algo der errado
}
