import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from "@mui/material";
import { MiniDrawer } from "../components";
import { SpaceStyle } from "./styles";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer />
      <Typography>Home do Aplicativo</Typography>
      <Button onClick={handleLogout} variant="contained" color="primary">
        Log Out
      </Button>
    </Box>
  );
};

export default Home;