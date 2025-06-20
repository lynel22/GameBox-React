import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, Container, CircularProgress } from "@mui/material";
import axios from "axios";

export default function AccountActivation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;

    hasRun.current = true;

    const verifyAccount = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/user/verify/account?token=${token}`);
        setStatus("success");
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        setStatus("error");
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      {status === "loading" && (
        <>
          <CircularProgress />
          <Typography mt={2}>Verificando cuenta...</Typography>
        </>
      )}
      {status === "success" && (
        <Typography variant="h5" color="success.main">
          ✅ ¡Tu cuenta ha sido activada! Redirigiendo...
        </Typography>
      )}
      {status === "error" && (
        <Typography variant="h5" color="error.main">
          ❌ Hubo un error al verificar tu cuenta. Intenta de nuevo.
        </Typography>
      )}
    </Container>
  );
}
