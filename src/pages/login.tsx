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

    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f5f5f5", // Um cinza suave para melhorar o contraste
    margin: 0,
    padding: 0,
  }}
>
  <Stack
    spacing={3}
    sx={{
      width: "360px", // Ligeiramente maior para melhor usabilidade
      padding: 3,
      backgroundColor: "#ffffff", // Cor de fundo do card
      borderRadius: 2, // Bordas arredondadas
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Adiciona sombra para destacar o card
    }}
  >
    <Typography variant="h5" textAlign="center" fontWeight="bold" sx={{ color: "primary.main" }}>
      Login
    </Typography>
    <TextField
      label="Email"
      variant="outlined"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      fullWidth
    />
    <TextField
      label="Senha"
      variant="outlined"
      type="password"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      fullWidth
    />
    {error && (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    )}
    <Button
      variant="contained"
      onClick={SignIn}
      sx={{
        paddingY: 1.5,
        fontWeight: "bold",
        textTransform: "none", // Remove o texto em maiúsculas
      }}
    >
      Entrar
    </Button>
  </Stack>
</Box>
  
  );
};

export default Login;
