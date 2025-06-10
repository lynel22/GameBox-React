import {
  Box,
  IconButton,
  InputBase,
  Typography,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import gameboxIcon from "../assets/icons/gamebox.png";
import UserMenu from "./UserMenu";

const drawerWidth = 240;

export default function Header({ open, toggleDrawer }) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        ml: open ? `${drawerWidth}px` : 0,
        right: 0,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        bgcolor: "#121212",
        borderBottom: "1px solid #222",
        zIndex: 1300,
        transition: "margin-left 0.3s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: "#fff",
            mr: 2,
            "&:hover": { backgroundColor: "transparent" },
            "&:focus": { outline: "none" },
          }}
        >
          <MenuIcon sx={{ fontSize: 36 }} />
        </IconButton>

        <Box
          component="img"
          src={gameboxIcon}
          alt="Gamebox Icon"
          sx={{ width: 65, height: 65, mr: 2 }}
        />

        <Typography variant="h5" noWrap sx={{ color: "#fff", fontWeight: 600 }}>
          Gamebox
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          backgroundColor: alpha("#ffffff", 0.05),
          "&:hover": { backgroundColor: alpha("#ffffff", 0.1) },
          mr: 2,
          width: "40%",
          height: "50px",
          px: 2,
        }}
      >
        <InputBase
          placeholder="Buscar juegos…"
          sx={{ color: "inherit", flex: 1, height: "100%" }}
        />
        <SearchIcon sx={{ color: "#ccc" }} />
      </Box>

      <UserMenu />
    </Box>
  );
}
