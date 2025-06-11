// src/layout/Layout.jsx
import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";

const drawerWidth = 240;

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);
  const [selectedLibrary, setSelectedLibrary] = useState("general");

  const toggleDrawer = () => setOpen(!open);

  
  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", color: "#fff", width: "100vw" }}>
      <CssBaseline />

      <Header
        open={open}
        toggleDrawer={toggleDrawer}
        selectedLibrary={selectedLibrary}
        loadLibrary={handleLibrarySelect}
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
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
