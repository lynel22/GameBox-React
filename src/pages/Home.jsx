// src/pages/Home.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getGeneralLibrary, getLibraryByStore } from "../api/game";
import { useLayout } from "../context/LayoutContext"; 

export default function Home() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  const { selectedLibrary } = useLayout(); 

  const loadLibrary = async (type) => {
    try {
      let response;
      if (type === "general") {
        console.log("Loading general library");
        response = await getGeneralLibrary();
      } else {
        console.log("Loading library for type:", type);
        response = await getLibraryByStore(type);
      }

      setGames(response.data);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([]);
    }
  };


  useEffect(() => {
    loadLibrary(selectedLibrary); 
  }, [selectedLibrary]);

  return (
    <Box sx={{ mt: 2, pb: 4, pr: 4, pl: 2 }}>
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
  );
}
