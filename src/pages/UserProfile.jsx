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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import SteamLoginButton from "../components/SteamLoginButton";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [steamId, setSteamId] = useState(user?.steamId || null);

  useEffect(() => {
    if (user?.steamId) {
      console.log("🟩 Steam ID del usuario:", user.steamId);
    } else {
      console.log("🟥 El usuario no tiene Steam ID");
    }
  }, [user]);

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
        {/* Botón de editar */}
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

        {/* Contenido del perfil */}
        <Stack direction="row" spacing={5} alignItems="center">
          <Avatar
            src={import.meta.env.VITE_API_URL + user.imageUrl}
            alt={user.username}
            sx={{
              width: 100,
              height: 100
            }}
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
                <Typography variant="body2" color="#fff">
                  Cuenta de Steam vinculada: {steamId}
                </Typography>
              ) : (  
                <SteamLoginButton />
                
              )}
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
