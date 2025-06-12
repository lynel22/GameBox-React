import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail, unlockAchievement } from "../api/game";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function GameDetail() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

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
              sx={{
                width: 760,
                height: 450,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <Box
                component="img"
                src={game.imageUrl}
                alt={game.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Box>
          <Typography variant="h4" mt={2} sx={{ textAlign: "left" }}>
            {game.name}
          </Typography>
        </Box>

        {/* Descripción + Metadatos */}
        <Box flex={1}>
          <Box sx={{ textAlign: "justify", position: "relative" }}>
            <Typography paragraph>
              {game.description.length > 300
                ? `${game.description.slice(0, 300)}...`
                : game.description}
            </Typography>

            {game.description.length > 300 && (
              <IconButton
                size="small"
                onClick={() => setShowFullDesc(true)}
                disableRipple
                sx={{
                  position: "absolute",
                  right: 10,
                  bottom: -8,
                  color: "var(--color-primary)",
                }}
              >
                <MoreHorizIcon />
              </IconButton>
            )}
          </Box>

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
      <Box mt={2}>
        <Box display="flex" alignItems="center" gap={6} mt={0}>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6">
              {game.hoursPlayed?.toFixed(1) || 0} horas jugadas
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CalendarTodayIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6">
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
        mt={3}
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

          <Box display="flex" mt={2} ml={1} flexWrap="wrap">
            {game.achievements.map((ach, i) => (
              <Box
                key={i}
                component="img"
                src={ach.imageUrl}
                alt={ach.name}
                width={45}
                height={45}
                sx={{
                  opacity: ach.unlocked ? 1 : 0.3,
                  mr: 1,
                  mb: 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
                onClick={() => {
                  setSelectedAchievement(ach);
                  setAchievementDialogOpen(true);
                }}
              />
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

      {/* Dialogo: Descripción completa */}
      <Dialog
        open={showFullDesc}
        onClose={() => setShowFullDesc(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Descripción completa</DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "justify" }}>
            {game.description}
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Dialogo: Logro detallado */}
      <Dialog
        open={achievementDialogOpen}
        onClose={() => setAchievementDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{  }}
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  component="img"
                  src={selectedAchievement.imageUrl}
                  alt={selectedAchievement.name}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                />
                <Typography variant="h6" >{selectedAchievement.name}</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {selectedAchievement.description}
              </Typography>
              {selectedAchievement.unlocked ? (
                <Typography variant="body2" color="grey">
                  DESBLOQUEADO EL{" "}
                  {new Date(selectedAchievement.dateUnlocked).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Typography>
              ) : (
                <Box mt={2} textAlign="left">
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1D5ECF",
                      color: "white",
                      border: "none",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      try {
                        await unlockAchievement(gameId, selectedAchievement.id);
                        selectedAchievement.unlocked = true;
                        selectedAchievement.dateUnlocked = new Date().toISOString();
                        setGame({ ...game }); // Forzar re-render
                        setAchievementDialogOpen(false);
                      } catch (error) {
                        alert("Error al marcar logro como desbloqueado.");
                        console.error(error);
                      }
                    }}
                  >
                    Marcar como desbloqueado
                  </button>
                </Box>
              )}
            </DialogContent>


          </>
        )}
      </Dialog>
    </Box>
  );
}
