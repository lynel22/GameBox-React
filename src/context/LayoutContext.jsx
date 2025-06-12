// src/context/LayoutContext.jsx
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedLibrary, setSelectedLibrary] = useState("general");

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        drawerOpen,
        toggleDrawer,
        selectedLibrary,
        setSelectedLibrary,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
