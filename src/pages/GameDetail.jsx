// src/pages/GameDetail.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail } from "../api/game";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function GameDetail() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await getGameDetail(gameId);
        setGame(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetail();
  }, [gameId]);

  if (!game) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const unlocked = game.achievements.filter((a) => a.unlocked).length;
  const total = game.achievements.length;
  const percentage = Math.round((unlocked / total) * 100);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
      {/* Imagen + Info */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
        alignItems="flex-start"
      >
        {/* Imagen + Nombre */}
        <Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ overflow: "hidden" }}
          >
            <Box
              component="img"
              src={game.imageUrl}
              alt={game.name}
              sx={{
                height: 450,
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography variant="h4" mt={2} sx={{ textAlign: "left" }}>
            {game.name}
          </Typography>
        </Box>

        {/* Descripción + Metadatos */}
        <Box flex={1}>
          <Typography
            paragraph
            sx={{
              maxHeight: "350px",
              overflow: "hidden",
              textAlign: "justify",
            }}
          >
            {game.description}
          </Typography>

          <Typography sx={{ textAlign: "left" }}>
            <strong>Fecha de lanzamiento:</strong> {game.releaseDate}
          </Typography>
          <Typography sx={{ textAlign: "left" }}>
            <strong>Desarrollador:</strong> {game.developer?.name}
          </Typography>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={1}
            mt={1}
            sx={{ alignItems: "center", textAlign: "center" }}
          >
            <Typography mt={2}>
              <strong>Géneros:</strong>
            </Typography>
            {game.genres.map((genre) => (
              <Chip
                sx={{ bgcolor: "#1D5ECF", color: "#fff" }}
                key={genre.id}
                label={genre.spanishName || genre.name}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Stats generales */}
      <Box mt={3}>
        <Box display="flex" alignItems="center" gap={3} mt={1}>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography>
              {game.hoursPlayed?.toFixed(1) || 0} horas jugadas
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CalendarTodayIcon sx={{ mr: 1 }} />
            <Typography>
              Última sesión:{" "}
              {game.lastPlayed
                ? new Date(game.lastPlayed).toLocaleDateString()
                : "Nunca"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Logros y amigos */}
      <Box
        mt={4}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
      >
        {/* Logros */}
        <Box flex={{ xs: "1 1 100%", md: "0 0 64%" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="h6">Logros Conseguidos</Typography>
            <Typography variant="body1">
              {unlocked}/{total} ({percentage}%)
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 1,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1D5ECF",
              },
            }}
          />

          <Box display="flex" mt={2} flexWrap="wrap">
            {game.achievements.map((ach, i) => (
              <Tooltip key={i} title={ach.name}>
                <Box
                  component="img"
                  src={ach.imageUrl}
                  alt={ach.name}
                  width={40}
                  height={40}
                  sx={{ opacity: ach.unlocked ? 1 : 0.3, mr: 1, mb: 1 }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Amigos */}
        <Box flex={{ xs: "1 1 100%", md: "0 0 36%" }}>
          <Typography variant="h6">
            {game.friendsThatOwnIt.length} amigo(s) tienen este juego
          </Typography>
          <Box display="flex" gap={2} mt={1} flexWrap="wrap">
            {game.friendsThatOwnIt.map((friend, i) => (
              <Tooltip key={i} title={friend.username}>
                <Avatar src={friend.imageUrl} />
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
