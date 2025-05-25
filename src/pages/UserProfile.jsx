import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import SteamLoginButton from "../components/SteamLoginButton";
import { unlinkSteamAccount } from "../api/auth"; 

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [steamId, setSteamId] = useState(user?.steamId || null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user?.steamId) {
      console.log("🟩 Steam ID del usuario:", user.steamId);
    } else {
      console.log("🟥 El usuario no tiene Steam ID");
    }
  }, [user]);

  const handleUnlinkSteam = async () => {
    try {
      console.log("🧹 Desvinculando cuenta de Steam...");

      const response = await unlinkSteamAccount();
      if (!response.ok) {
        console.error("❌ Error al desvincular Steam:", response.message);
        return;
      }

      // Actualiza el estado local y contexto si es necesario
      setSteamId(null);
      setOpenDialog(false);
      // También podrías actualizar el contexto global con setUser({...user, steamId: null});
    } catch (error) {
      console.error("❌ Error al desvincular Steam:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


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
        <Typography variant="h6">Debes iniciar sesión para ver tu perfil.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "75vh",
          background: "linear-gradient(135deg, #161616, #2a2a2a)",
          color: "#ffffff",
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 800,
        }}
      >
        <Paper
          elevation={9}
          sx={{
            backgroundColor: "#1e1e1e",
            p: 4,
            borderRadius: 4,
            border: "1px solid #333",
            width: "100%",
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
              "&:hover": {
                backgroundColor: "#1A4DAF",
              },
            }}
          >
            <EditIcon />
          </IconButton>

          <Stack direction="row" spacing={5} alignItems="center">
            <Avatar
              src={import.meta.env.VITE_API_URL + user.imageUrl}
              alt={user.username}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {user.username}
              </Typography>
              <Stack direction="row" spacing={1} mt={2} alignItems="center">
                <Chip label={`Nivel ${user.level || 1}`} sx={{ color: "#fff" }} />
                <Typography variant="caption" color="#aaa">
                  {user.title || "Gamer sin título"}
                </Typography>
              </Stack>
              <Box mt={3}>
                {steamId ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="#fff">
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

      {/* Dialog de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="unlink-dialog-title"
      >
        <DialogTitle id="unlink-dialog-title" sx={{ textAlign: "center" }}>
          ¿Desvincular cuenta de Steam?
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Esta acción eliminará la vinculación de tu cuenta de Steam. ¿Deseas continuar?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            paddingBottom: 2,
          }}
        >
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleUnlinkSteam}
            
            sx={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d9363e",
              },
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
