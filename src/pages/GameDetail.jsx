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
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "../components/Header";

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
    <Box sx={{ bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <Header open={false} toggleDrawer={() => {}} />

      <Box sx={{ pt: "130px", pb: 6 }}>
        {/* Imagen + Info */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          alignItems="flex-start"
          px={{ xs: 2, md: 6 }} // un poco de padding horizontal solo para móviles
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
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography variant="h4" mt={2}>
              {game.name}
            </Typography>
          </Box>

          {/* Descripción + Metadatos */}
          <Box flex={1}>
            <Typography paragraph>{game.description}</Typography>

            <Typography>
              <strong>Fecha de lanzamiento:</strong> {game.releaseDate}
            </Typography>
            <Typography>
              <strong>Desarrollador:</strong> {game.developer?.name}
            </Typography>

            <Typography mt={2}>
              <strong>Géneros:</strong>
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {game.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.spanishName || genre.name}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Stats y logros */}
        <Box mt={6} px={{ xs: 2, md: 6 }}>
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

          <Typography mt={2}>
            Logros Conseguidos {unlocked}/{total} ({percentage}%)
          </Typography>
          <Box display="flex" mt={1} flexWrap="wrap">
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
        <Box mt={4} px={{ xs: 2, md: 6 }}>
          <Typography variant="h6">
            {game.friendsThatOwnIt.length} amigo(s) tienen este juego
          </Typography>
          <Box display="flex" gap={2} mt={1}>
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
