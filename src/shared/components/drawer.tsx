import * as React from "react";
import { useNavigate } from "react-router-dom";
// Material UI
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Button  from "@mui/material/Button";

// Ícones
import PieChartIcon from "@mui/icons-material/PieChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ClassIcon from "@mui/icons-material/Class";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LayersIcon from "@mui/icons-material/Layers";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build"; // Ícone para "Serviços"
import ExpandLess from "@mui/icons-material/ExpandLess"; //Icone fechar
import ExpandMore from "@mui/icons-material/ExpandMore"; //Icone abrir
import CategoryIcon from '@mui/icons-material/Category'; //Insumo

const drawerWidth = 230;



interface DrawerProps {
  children: React.ReactNode;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function MiniDrawer({ children }: DrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openServices, setOpenServices] = React.useState(false);
  const [openProduction, setOpenProduction] = React.useState(false);
  const [openService, setOpenService] = React.useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ArtFox Sistemas
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            sx={{ borderColor: "white", color: "white" }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List>
          {/* Dashboard */}
          <ListItemButton component={Link} to="/Dashboard">
            <ListItemIcon>
              <PieChartIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* Cliente */}
          <ListItemButton component={Link} to="/Cliente">
            <ListItemIcon>
              <BadgeIcon />
            </ListItemIcon>
            <ListItemText primary="Cliente" />
          </ListItemButton>
          <Divider sx={{ bgcolor: "primary.main" }} />
          {/* Finanças */}
          <ListItemButton onClick={() => setOpenServices(!openServices)}>
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Finanças" />
            {openServices ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openServices} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <ListItemButton component={Link} to="/Financeiro" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <CurrencyExchangeIcon />
                </ListItemIcon>
                <ListItemText primary="Financeiro" />
              </ListItemButton>
              <ListItemButton component={Link} to="/Banco" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Banco" />
              </ListItemButton>

            </List>
          </Collapse>
          <Divider sx={{ bgcolor: "primary.main" }} />
          {/* Produção */}
          <ListItemButton onClick={() => setOpenProduction(!openProduction)}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Produção" />
            {openProduction ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={openProduction} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/Produto" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Produto" />
              </ListItemButton>

              <ListItemButton component={Link} to="/Insumo" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Insumo" />
              </ListItemButton>

              <ListItemButton component={Link} to="/Categoria" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText primary="Categoria" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ bgcolor: "primary.main" }} />

          {/* Serviço */}
          <ListItemButton onClick={() => setOpenService(!openService)}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Serviços" />
            {openService ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openService} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/Compra" sx={{ pl: 3 }}>
                <ListItemIcon>
                  <LocalMallIcon />
                </ListItemIcon>
                <ListItemText primary="Compra" />
              </ListItemButton>
              <ListItemButton component={Link} to="/Venda" sx={{ pl: 3   }}>
                <ListItemIcon>
                  <SellIcon />
                </ListItemIcon>
                <ListItemText primary="Venda" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ bgcolor: "primary.main" }} />

          {/* Usuário */}
          <ListItemButton component={Link} to="/Usuario">
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Usuário" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main">
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

export default MiniDrawer;
