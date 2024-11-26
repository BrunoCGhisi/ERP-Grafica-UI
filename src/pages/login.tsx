import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function SignIn() {
    try {
      console.log("LOGIN", email)
      console.log("LOGIN", senha)
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        senha: senha,
      });
      const { access_token } = response.data;
      console.log("LOGIN", response.data)
      localStorage.setItem("token", access_token); // Armazena token no localStorage
      navigate("/dashboard"); // Navega para a rota "home"
    } catch (error: any) {
      setError("Falha no login. Verifique suas credenciais.");
      console.error(error);
    }
  }


  return (

      <Box sx={{
        width: "100vw",        
        height: "100vh",       
        backgroundColor: "#fff",
        margin: 0,
        padding: 0,
      }}>
        <Stack spacing={2} sx={{ width: "300px", margin: "20px auto", padding: 1 }}>
          <Typography variant="h4">Login</Typography>
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
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={SignIn}>
            Entrar
          </Button>
        </Stack>
      </Box>
  
  );
};

export default Login;
