import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Button
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (loading) return <CircularProgress size={24} />;

  if (!user) {
    return (
      <Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500
          }}
        >
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          borderRadius: "10%",
          border: "0px solid #ccc",
          "&:focus": {
            outline: "none"
          }
        }}
      >
        <Avatar
          src={import.meta.env.VITE_API_URL + user.imageUrl}
          alt={user.username}
          sx={{ width: 32, height: 32 }}
        />
        <Typography sx={{ color: "skyblue", ml: 1 }}>
          {user.username}
        </Typography>
        <ArrowDropDownIcon sx={{ color: "skyblue" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: 1.5 }}
      >
        <MenuItem onClick={handleProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
}
