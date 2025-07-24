import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
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
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SteamLoginButton from "../components/SteamLoginButton";
import { unlinkSteamAccount } from "../api/auth";
import { getUserProfile } from "../api/user";
import storeLogos from "../constants/storelogos";

export default function UserProfile() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [steamId, setSteamId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (userId) {
          const res = await getUserProfile(userId);
          setProfileData(res.data);
          setSteamId(res.data.steamId || null);
        } else if (user) {
          setProfileData(user);
          setSteamId(user.steamId || null);
        }
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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

  if (loading || !profileData) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const isOwn = user && user.id === profileData.id;

  return (
    <>
      {/* Cabecera */}
      <Box
        sx={{
          color: "#ffffff",
          px: 4,
          py: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            p: 2,
            position: "relative",
          }}
        >
          {isOwn && (
            <IconButton
              onClick={() => navigate("/edit-profile")}
              sx={{
                position: "absolute",
                top: 20,
                right: 10,
                color: "#fff",
                backgroundColor: "#1D5ECF",
                "&:hover": { backgroundColor: "#1A4DAF" },
              }}
            >
              <EditIcon />
            </IconButton>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Avatar
              src={import.meta.env.VITE_API_URL + profileData.imageUrl}
              alt={profileData.username}
              sx={{ width: 120, height: 120 }}
            />
            <Box flex={1}>
              <Typography textAlign="left" variant="h4" fontWeight="bold">
                {profileData.username}
              </Typography>
              <Typography textAlign="left" variant="body2" color="#ccc" mt={1}>
                {profileData.email}
              </Typography>

              {!userId && (
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
              )}

            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Biblioteca */}
      <Box sx={{ px: 4, paddingBottom: 4, paddingTop: 1 }}>
        <Box sx={{ maxWidth: 1100, margin: "0 auto" }}>
          <Typography
            textAlign="left"
            paddingLeft={2}
            variant="h6"
            sx={{ mb: 2, color: "#fff" }}
          >
            {isOwn
              ? "Tu Biblioteca"
              : `Biblioteca de ${profileData.username}`} ({profileData.totalGames})
          </Typography>

          {profileData.games.map((game) => {
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

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.9rem" }}
                      color="#aaa"
                    >
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

      {/* Diálogo para desvincular Steam */}
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
