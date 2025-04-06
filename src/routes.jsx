import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Home from "./pages/Home"; 
// puedes ir importando más vistas aquí

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* Añade más rutas según tu app */}
      </Routes>
    </Router>
  );
}
