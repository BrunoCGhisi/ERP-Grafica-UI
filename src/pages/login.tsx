import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  async function SignIn() {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        senha: senha,
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token); // Armazena token no localStorage
      navigate('/home'); // Navega para a rota "home"
    } catch (error: any) {
      setError("Falha no login. Verifique suas credenciais.");
      console.error(error);
    }
  }

  return (
    <Box>
      <Box>
        <Typography variant="h4">
          Bem-vindo ao Login
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6">
          Logar
        </Typography>

        <Stack spacing={2} sx={{ width: '300px', margin: '20px auto' }}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {error && (
            <Typography color="error">{error}</Typography>
          )}
          <Button variant="contained" onClick={SignIn}>
            Entrar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
