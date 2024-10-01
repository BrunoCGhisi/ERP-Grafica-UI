export type PayLoadVO = {
    userId: number;
    nome: string;
    isAdm: boolean;
    exp?: number; // Se você também tiver a data de expiração (exp) no token
}