import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AccountActivation from "./pages/AccountActivation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import RequireAuth from "./components/RequireAuth";
import UserProfile from "./pages/UserProfile";
import SteamCallback from "./pages/SteamCallback";
import GameDetail from "./pages/GameDetail";
import Layout from "./components/Layout";
import Wishlist from "./pages/Wishlist";
import Deals from "./pages/Deals";
import Friends from "./pages/Friends";
import RecommendationsPage from "./pages/RecommendationsPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account-activation" element={<AccountActivation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas con Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/deals" element={<Deals />} />

          {/* Rutas privadas dentro del layout */}
          <Route element={<RequireAuth />}>
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/auth/steam/callback" element={<SteamCallback />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
