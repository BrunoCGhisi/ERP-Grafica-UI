import { jwtDecode } from 'jwt-decode'; // Importação correta do jwt-decode
import { PayLoadVO } from './types'; 

export async function getToken(): Promise<PayLoadVO | null> {
  try {
    const token = localStorage.getItem('token'); 
    if (token) {
      const decodedToken = jwtDecode<PayLoadVO>(token); 
      return decodedToken; 
    }
  } catch (error) {
    console.log('Erro ao obter o token:', error);
  }
  return null; 
}
