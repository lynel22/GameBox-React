
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail } from "../api/game";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
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
        console.log("Game details fetched:", response.data);
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
    <Box p={4}>
      <Grid container spacing={4}>
        {/* Imagen + Datos generales */}
        <Grid item xs={12} md={6}>
          <Box
            border="2px solid black"
            height={400}
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
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        {/* Descripción y metadatos */}
        <Grid item xs={12} md={6}>
          <Typography paragraph>{game.description}</Typography>
          <Typography>Fecha lanzamiento: {game.releaseDate}</Typography>
          <Typography>Desarrollador: {game.developer?.name}</Typography>
          <Typography mt={1}>Géneros:</Typography>
          {game.genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.spanishName || genre.name}
              sx={{ mr: 1, mt: 1 }}
            />
          ))}
        </Grid>
      </Grid>

      {/* Stats y logros */}
      <Box mt={4}>
        <Typography variant="h5">{game.name}</Typography>
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
                src={ach.icon}
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
      <Box mt={4}>
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
  );
};


