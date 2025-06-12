import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useLayout } from "../context/LayoutContext";

export default function Layout() {
  const { drawerOpen, toggleDrawer, selectedLibrary, setSelectedLibrary } = useLayout();

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", color: "#fff", width: "100vw" }}>
      <CssBaseline />
      <Header
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
        selectedLibrary={selectedLibrary}
        loadLibrary={setSelectedLibrary}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#121212",
          pt: "120px",
          pl: 2,
          pr: 2,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
