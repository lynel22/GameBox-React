// src/components/Header.jsx

import {
  Box,
  IconButton,
  InputBase,
  Typography,
  alpha,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  Storage as StorageIcon,
  StarBorder,
  History,
} from "@mui/icons-material";
import gameboxIcon from "../assets/icons/gamebox.png";
import UserMenu from "./UserMenu";
import steamIcon from "../assets/icons/steam.png";
import epicIcon from "../assets/icons/epic.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Header({ open, toggleDrawer, selectedLibrary, loadLibrary }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Drawer lateral */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          display: open ? "block" : "none",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#1e1e1e",
            color: "#fff",
            borderRight: 0,
            height: "100vh",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" sx={{ color: "#888" }}>
            BIBLIOTECAS
          </Typography>
          <List>
            <ListItemButton selected={selectedLibrary === "general"} onClick={() => { loadLibrary("general"); navigate("/"); }}>
              <ListItemIcon>
                <StorageIcon sx={{ color: "#1D5ECF" }} />
              </ListItemIcon>
              <ListItemText primary="General" />
            </ListItemButton>

            <ListItemButton selected={selectedLibrary === "steam"} onClick={() => { loadLibrary("steam"); navigate("/"); }}>
              <ListItemIcon>
                <img src={steamIcon} alt="Steam" style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Steam" />
            </ListItemButton>

            <ListItemButton selected={selectedLibrary === "epic"} onClick={() => { loadLibrary("epic"); navigate("/"); }}>
              <ListItemIcon>
                <img src={epicIcon} alt="Epic Games" style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Epic Games" />
            </ListItemButton>
          </List>

          <Typography variant="overline" sx={{ mt: 4, color: "#888" }}>
            COLECCIONES
          </Typography>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <StarBorder sx={{ color: "#1D5ECF" }} />
              </ListItemIcon>
              <ListItemText primary="Favoritos" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <History sx={{ color: "#1D5ECF" }} />
              </ListItemIcon>
              <ListItemText primary="Recientes" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Barra superior */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          // left: 0,
          left: open ? `${drawerWidth}px` : 0,
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",

          right: 0,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          bgcolor: "#121212",
          borderBottom: "1px solid #222",
          zIndex: 1300,
          transition: "margin-left 0.3s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: "#fff",
              mr: 2,
              "&:hover": { backgroundColor: "transparent" },
              "&:focus": { outline: "none" },
            }}
          >
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>

          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Box
              component="img"
              src={gameboxIcon}
              alt="Gamebox Icon"
              sx={{ width: 65, height: 65, mr: 1 }}
            />
            <Typography variant="h5" noWrap sx={{ color: "#fff", fontWeight: 600 }}>
              Gamebox
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            backgroundColor: alpha("#ffffff", 0.05),
            "&:hover": { backgroundColor: alpha("#ffffff", 0.1) },
            mr: 2,
            width: "40%",
            height: "50px",
            px: 2,
          }}
        >
          <InputBase
            placeholder="Buscar juegos…"
            sx={{ color: "inherit", flex: 1, height: "100%" }}
          />
          <SearchIcon sx={{ color: "#ccc" }} />
        </Box>

        <UserMenu />
      </Box>
    </>
  );
}
