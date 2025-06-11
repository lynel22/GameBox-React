import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Storage as StorageIcon,
  SportsEsports as GamepadIcon,
  StarBorder,
  History,
  VideogameAsset,
} from "@mui/icons-material";
import UserMenu from "../components/UserMenu";
import { getGeneralLibrary, getSteamLibrary, getEpicLibrary } from "../api/game";
import steamIcon from "../assets/icons/steam.png";
import epicIcon from "../assets/icons/epic.png";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // 👈 Importa el Header
import gameboxIcon from "../assets/icons/gamebox.png";

const drawerWidth = 240;

export default function Home() {
  const [open, setOpen] = useState(true);
  const [selectedLibrary, setSelectedLibrary] = useState("general");
  const [games, setGames] = useState([]);

  const toggleDrawer = () => setOpen(!open);
  const navigate = useNavigate();

  const loadLibrary = async (type) => {
    setSelectedLibrary(type);
    try {
      let response;
      if (type === "general") {
        response = await getGeneralLibrary();
      } else if (type === "steam") {
        response = await getSteamLibrary();
      } else if (type === "epic") {
        response = await getEpicLibrary();
      }
      setGames(response.data);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([]);
    }
  };

  useEffect(() => {
    loadLibrary("general");
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#121212", color: "#fff", width: "100vw" }}>
      <CssBaseline />

      {/* Sidebar */}
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
            <ListItemButton selected={selectedLibrary === "general"} onClick={() => loadLibrary("general")}>
              <ListItemIcon>
                <StorageIcon sx={{ color: "#1D5ECF" }} />
              </ListItemIcon>
              <ListItemText primary="General" />
            </ListItemButton>

            <ListItemButton selected={selectedLibrary === "steam"} onClick={() => loadLibrary("steam")}>
              <ListItemIcon>
                <img src={steamIcon} alt="Steam" style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Steam" />
            </ListItemButton>

            <ListItemButton selected={selectedLibrary === "epic"} onClick={() => loadLibrary("epic")}>
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

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#121212",
          minHeight: "100vh",
          pt: "100px",
          pl: 4,
          pr: 4,
          transition: "margin-left 0.3s",
          marginLeft: 0,
        }}
      >
        {/* Header separado */}
        <Header open={open} toggleDrawer={toggleDrawer} />

        {/* Contenido real */}
        <Box sx={{ mt: 4, pb: 4, width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 1, textTransform: "capitalize" }}>
            {selectedLibrary}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#aaa", mb: 4 }}>
            {games.length} juegos disponibles
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {games.map((game) => (
              <Card
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                sx={{
                  bgcolor: "#1e1e1e",
                  color: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={game.imageUrl || "/default-image.jpg"}
                  alt={game.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {game.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
