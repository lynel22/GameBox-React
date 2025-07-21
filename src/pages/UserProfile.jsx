import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardMedia,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SteamLoginButton from "../components/SteamLoginButton";
import { unlinkSteamAccount } from "../api/auth";
import storeLogos from "../constants/storelogos";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [steamId, setSteamId] = useState(user?.steamId || null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setSteamId(user?.steamId || null);
  }, [user]);

  const handleUnlinkSteam = async () => {
    try {
      const response = await unlinkSteamAccount();
      if (!response.ok) {
        console.error("❌ Error al desvincular Steam:", response.message);
        return;
      }
      setSteamId(null);
      setOpenDialog(false);
    } catch (error) {
      console.error("❌ Error al desvincular Steam:", error);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          background: "linear-gradient(135deg, #161616, #2a2a2a)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          background: "linear-gradient(135deg, #161616, #2a2a2a)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          Debes iniciar sesión para ver tu perfil.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Cabecera del perfil */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #161616, #2a2a2a)",
          color: "#ffffff",
          px: 4,
          py: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={9}
          sx={{
            backgroundColor: "#2a2a2a",
            borderRadius: 4,
            border: "1px solid #333",
            width: "100%",
            maxWidth: 1100,
            p: 4,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => navigate("/edit-profile")}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#fff",
              backgroundColor: "#1D5ECF",
              "&:hover": { backgroundColor: "#1A4DAF" },
            }}
          >
            <EditIcon />
          </IconButton>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Avatar
              src={import.meta.env.VITE_API_URL + user.imageUrl}
              alt={user.username}
              sx={{ width: 120, height: 120 }}
            />
            <Box flex={1}>
              <Typography textAlign="left" variant="h4" fontWeight="bold">
                {user.username}
              </Typography>
              <Typography textAlign="left" variant="body2" color="#ccc" mt={1}>
                {user.email}
              </Typography>

              <Box mt={2} textAlign="left">
                {steamId ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2">
                      Cuenta de Steam vinculada: {steamId}
                    </Typography>
                    <IconButton
                      onClick={handleOpenDialog}
                      sx={{
                        color: "#ff4d4f",
                        backgroundColor: "#2a2a2a",
                        "&:hover": {
                          backgroundColor: "#ff4d4f",
                          color: "#fff",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ) : (
                  <SteamLoginButton />
                )}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Corte de color brusco para la biblioteca */}
      <Box
        sx={{
          backgroundColor: "#1c1c1c",
          color: "#ffffff",
          px: 4,
          py: 3,
        }}
      >
        <Box sx={{ maxWidth: 1100, margin: "0 auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tu Biblioteca ({user.totalGames})
          </Typography>

          {user.games.map((game) => {
            const achievementPercentage = game.totalAchievements
              ? (game.achievementsUnlocked / game.totalAchievements) * 100
              : 0;

            return (
              <Box
                key={game.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  bgcolor: "#2a2a2a",
                  borderRadius: 2,
                  mb: 3,
                  overflow: "hidden",
                  boxShadow: 2,
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  image={game.imageUrl || "/default-image.jpg"}
                  alt={game.name}
                  sx={{
                    width: 250,
                    height: 150,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/game/${game.id}`)}
                />

                <Box sx={{ flex: 1, p: 2, position: "relative" }}>
                  {/* Icono de la tienda arriba derecha */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {game.storeName && storeLogos[game.storeName] && (
                      <Tooltip title={game.storeName}>
                        <img
                          src={storeLogos[game.storeName]}
                          alt={game.storeName}
                          style={{ width: 24, height: 24 }}
                        />
                      </Tooltip>
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    color="white"
                    sx={{
                      textAlign: "left",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    {game.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#aaa"
                    sx={{ mt: 1, textAlign: "left" }}
                  >
                    {game.hoursPlayed.toFixed(1)} h jugadas
                    {game.lastSession &&
                      ` · Última sesión: ${new Date(
                        game.lastSession
                      ).toLocaleDateString()}`}
                  </Typography>

                  {/* Logros abajo izquierda */}
                  <Box sx={{ position: "absolute", bottom: 16, left: 16, textAlign: "right" }}>
                    <Typography variant="caption" sx={{fontSize: "0.9rem"}}  color="#aaa">
                      Logros: {game.achievementsUnlocked}/
                      {game.totalAchievements}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "#333",
                        overflow: "hidden",
                        width: 820,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${achievementPercentage}%`,
                          height: "100%",
                          backgroundColor: "#1D5ECF",
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Diálogo de desvinculación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ textAlign: "center" }}>
          ¿Desvincular cuenta de Steam?
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Esta acción eliminará la vinculación de tu cuenta de Steam. ¿Deseas
            continuar?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleUnlinkSteam}
            variant="contained"
            sx={{
              backgroundColor: "#ff4d4f",
              "&:hover": { backgroundColor: "#d9363e" },
              color: "#fff",
              ml: 2,
            }}
          >
            Desvincular
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
