import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail, unlockAchievement, addGameToLibraries } from "../api/game";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import storeLogos from "../constants/storelogos"; 
import { addGameToWishlist, removeGameFromWishlist } from "../api/game";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DialogActions from "@mui/material/DialogActions";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");


export default function GameDetail() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);


  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await getGameDetail(gameId);
        setGame(response.data);
        setIsInWishlist(response.data.inWishlist);
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

  const toggleStoreSelection = (storeId) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

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

            {/* Oferta destacada justo debajo de los géneros */}
            {game.deals?.length > 0 && (
              <Box mt={3}>
                <a
                  href={game.deals[0].dealLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                      bgcolor: "#2a2a2a",
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 2,
                      width: "fit-content",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* Logo tienda */}
                    {storeLogos[game.deals[0].storeName] && (
                      <Tooltip title={game.deals[0].storeName}>
                        <img
                          src={storeLogos[game.deals[0].storeName]}
                          alt={game.deals[0].storeName}
                          style={{ width: 32, height: 32 }}
                        />
                      </Tooltip>
                    )}

                    {/* Precios */}
                    <Box>
                      <Typography
                        variant="body2"
                        color="limegreen"
                        sx={{ fontWeight: 600 }}
                      >
                        -{Math.round(game.deals[0].savings)}%
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}
                      >
                        {parseFloat(game.deals[0].salePrice).toFixed(2)}€
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "#aaa",
                          fontSize: "0.8rem",
                        }}
                      >
                        {parseFloat(game.deals[0].normalPrice).toFixed(2)}€
                      </Typography>
                    </Box>
                  </Box>
                </a>
              </Box>
            )}

          </Box>
        </Box>
      </Box>

      {/* Stats generales o botón de añadir */}
      <Box mt={2}>
        {game.ownedByUser ? (
          <Box display="flex" alignItems="center" gap={6}>
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
        ) : (
          <Box mt={2}>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              mt={2}
              gap={2}
            >
              {/* Botón añadir a biblioteca */}
              <Button
                variant="text"
                startIcon={<AddCircleIcon sx={{ color: "#fff" }} />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  color: "#1D5ECF",
                  fontWeight: 600,
                  textTransform: "none",
                  border: "none",
                  backgroundColor: "rgba(29, 94, 207, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(29, 94, 207, 0.08)",
                  },
                }}
              >
                Añadir a tu biblioteca
              </Button>

              {/* Botón wishlist */}
              <Button
                variant="text"
                startIcon={
                  isInWishlist ? (
                    <FavoriteIcon sx={{ color: "#D81B60" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "#D81B60" }} />
                  )
                }
                onClick={async () => {
                  if (isInWishlist) {
                    setWishlistDialogOpen(true);
                  } else {
                    try {
                      await addGameToWishlist(game.id);
                      setIsInWishlist(true);
                    } catch (error) {
                      console.error("Error al añadir a la wishlist:", error);
                    }
                  }
                }}
                sx={{
                  color: "#D81B60",
                  fontWeight: 600,
                  textTransform: "none",
                  border: "none",
                  backgroundColor: isInWishlist
                    ? "rgba(216, 27, 96, 0.15)"
                    : "rgba(216, 27, 96, 0.08)",
                  "&:hover": {
                    backgroundColor: isInWishlist
                      ? "rgba(216, 27, 96, 0.2)"
                      : "rgba(216, 27, 96, 0.12)",
                  },
                }}
              >
                {isInWishlist ? "En lista de deseados" : "Añadir a lista de deseados"}
              </Button>
            </Box>
          </Box>
        )}
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
                <Avatar
                  src={import.meta.env.VITE_API_URL + friend.imageUrl}
                  alt={friend.username}
                  sx={{ width: 60, height: 60, ml: 1 }} // o el tamaño que quieras
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Dialogo: Descripción completa */}
      <Dialog open={showFullDesc} onClose={() => setShowFullDesc(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Descripción completa</DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "justify" }}>{game.description}</Typography>
        </DialogContent>
      </Dialog>

      {/* Dialogo: Logro detallado */}
      <Dialog open={achievementDialogOpen} onClose={() => setAchievementDialogOpen(false)} maxWidth="xs" fullWidth>
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  component="img"
                  src={selectedAchievement.imageUrl}
                  alt={selectedAchievement.name}
                  sx={{ width: 60, height: 60, borderRadius: 1, boxShadow: 2 }}
                />
                <Typography variant="h6">{selectedAchievement.name}</Typography>
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
                        setGame({ ...game });
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

      {/* Dialogo: Añadir a biblioteca */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Selecciona una o varias tiendas</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} mt={2}>
            {game.stores.map((store) => (
              <Box
                key={store.id}
                component="img"
                src={storeLogos[store.name] || "/assets/logos/default.png"}
                alt={store.name}
                onClick={() => toggleStoreSelection(store.id)}
                sx={{
                  objectFit: "cover",
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  cursor: "pointer",
                  boxShadow: selectedStoreIds.includes(store.id) ? 4 : 1,
                  filter: selectedStoreIds.includes(store.id)
                    ? "none"
                    : "grayscale(100%) opacity(0.5)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    filter: "none",
                  },
                }}
              />
            ))}
          </Box>

          <Box mt={4} display="flex" justifyContent="center">
            <button
              onClick={async () => {
                if (!selectedStoreIds.length) return;
                setIsAdding(true);
                try {
                  await addGameToLibraries(game.id, selectedStoreIds);
                  setGame({ ...game, ownedByUser: true });
                  setAddDialogOpen(false);
                  setSelectedStoreIds([]);
                } catch (error) {
                  console.error("Error al añadir juego:", error);
                  alert("Error al añadir el juego a tu biblioteca.");
                } finally {
                  setIsAdding(false);
                }
              }}
              disabled={selectedStoreIds.length === 0 || isAdding}
              style={{
                padding: "10px 20px",
                backgroundColor: selectedStoreIds.length ? "#1D5ECF" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                fontWeight: "bold",
                cursor: selectedStoreIds.length ? "pointer" : "not-allowed",
              }}
            >
              {isAdding ? "Añadiendo..." : "Añadir"}
            </button>
          </Box>
        </DialogContent>
      </Dialog>
      
      <Dialog
        open={wishlistDialogOpen}
        onClose={() => setWishlistDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Eliminar de la lista de deseados</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar este juego de tu lista de deseados?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWishlistDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              try {
                await removeGameFromWishlist(game.id);
                setIsInWishlist(false);
                setWishlistDialogOpen(false);
              } catch (error) {
                console.error("Error al eliminar de la wishlist:", error);
                alert("No se pudo eliminar el juego de la lista de deseados.");
              }
            }}
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
