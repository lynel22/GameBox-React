import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifySteamLogin } from "../api/auth"; // ajusta la ruta si es necesario

const SteamCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSteamVerification = async () => {
      const params = new URLSearchParams(window.location.search);
      console.log("🔗 Parámetros de Steam:", params.toString());
      const { ok, message } = await verifySteamLogin(params);

      if (ok) {
        console.log("✅ Steam vinculado:", message);
        navigate("/profile");
      } else {
        console.error("❌ Error al verificar Steam:", message);
        navigate("/error");
      }
    };

    handleSteamVerification();
  }, [navigate]);

  return (
    <div style={{ color: "#00ff99", padding: "2rem", textAlign: "center" }}>
      Verificando tu cuenta de Steam...
    </div>
  );
};

export default SteamCallback;
