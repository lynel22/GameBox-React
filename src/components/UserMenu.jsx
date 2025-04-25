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

  if (loading) return <CircularProgress size={32} />;

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
            fontWeight: 600,
            fontSize: "1.3rem",
            px: 3,
            py: 1
          }}
        >
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 , backgroundColor: "#2a2a2a", borderRadius: 2, }}>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 1,
          borderRadius: 2,
          border: "2px solid transparent",
          "&:focus": {
            outline: "none"
          }
        }}
      >
        <Avatar
          src={import.meta.env.VITE_API_URL + user.imageUrl}
          alt={user.username}
          sx={{ width: 48, height: 48 }}
        />
        <Typography sx={{ color: "#fff", ml: 2, fontSize: "1.2rem", fontWeight: 500 }}>
          {user.username}
        </Typography>
        <ArrowDropDownIcon sx={{ color: "#fff", fontSize: "2rem", ml: 1 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          marginTop: 1,
          "& .MuiMenuItem-root": {
            fontSize: "1.1rem",
            py: 1.5,
            px: 4.5
          }
        }}
      >
        <MenuItem onClick={handleProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
}
