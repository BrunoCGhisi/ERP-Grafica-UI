import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [isAdm, setIsAdm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const navigate = useNavigate();

  async function createAccount() {
    try {
      const response = await axios.post("http://localhost:3000/usuario", {
        nome: nome,
        email: email,
        senha: senha,
        isAdm: isAdm,
      });
      if (response.status === 200) {
        // Conta criada com sucesso, navega para a tela de login
        navigate('/login');
      }
    } catch (error: any) {
      setError("Falha ao criar conta. Verifique seus dados.");
      console.error(error);
    }
  }

  return (
    <Box>
      <Box>
        <Stack spacing={2} sx={{ width: '300px', margin: '20px auto' }}>
          <Typography variant="h4">
            Criação de Conta
          </Typography>
          <Typography variant="h6">
            Preencha os dados para criar uma nova conta
          </Typography>
          <TextField
            label="Nome"
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type={showPassword ? "text" : "password"} // Alterna entre 'text' e 'password'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)} // Alterna a visibilidade
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />} 
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Select
            labelId="select-label"
            id="demo-simple-select"
            value={isAdm}
            label="ADM?"
            onChange={(e) => setIsAdm(e.target.value)}
          >
            <MenuItem value={0}>Funcionário</MenuItem>
            <MenuItem value={1}>Administrador</MenuItem>
          </Select>
          {error && (
            <Typography color="error">{error}</Typography>
          )}
          <Button variant="contained" onClick={createAccount}>
            Criar Conta
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SignUp;
