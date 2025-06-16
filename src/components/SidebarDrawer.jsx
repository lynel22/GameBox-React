import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Storage as StorageIcon,
  StarBorder,
  History,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import storeLogos from "../constants/storelogos";
import { getLibraryGameCounts } from "../api/game";

const drawerWidth = 240;

export default function SidebarDrawer({ open, selectedLibrary, loadLibrary }) {
  const navigate = useNavigate();
  const [libraryCounts, setLibraryCounts] = useState([]);

  useEffect(() => {
    getLibraryGameCounts()
      .then((res) => {
        console.log("Library game counts response:", res); 
        setLibraryCounts(res.data || []);
      })
      .catch((err) => console.error("Error loading library counts:", err));
  }, [selectedLibrary, open, loadLibrary]);


  return (
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
          {/* Opción General */}
          <ListItemButton
            selected={selectedLibrary === "general"}
            onClick={() => {
              loadLibrary("general");
              navigate("/");
            }}
          >
            <ListItemIcon>
              <StorageIcon sx={{ color: "#1D5ECF" }} />
            </ListItemIcon>
            <ListItemText primary="General" />
          </ListItemButton>

          {/* Bibliotecas dinámicas */}
          {libraryCounts.map((store) => {
            const logoKey = store.name;
            const logoSrc = storeLogos[logoKey];

            return (
              <ListItemButton
                key={store.name}
                selected={selectedLibrary === store.name}
                onClick={() => {
                  loadLibrary(store.name);
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={store.name}
                      style={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <StorageIcon sx={{ color: "#1D5ECF" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span>{store.name}</span>
                      <Box
                        sx={{
                          bgcolor: "#424242", 
                          color: "#fff",
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "1rem",
                          ml: 1,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {store.gameCount}
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            );
          })}

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
  );
}
