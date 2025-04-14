import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Za-z]/, "Debe contener al menos una letra")
      .matches(/[0-9]/, "Debe contener al menos un número"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await validationSchema.validate({ password });

      await axios.post(`${import.meta.env.VITE_API_URL}/user/verify/password/submit`, null, {
        params: {
          token,
          password
        }
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message);
      } else {
        setError(err?.response?.data || "Error al restablecer la contraseña");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Restablecer contraseña
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Cambiar contraseña
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          ✅ ¡Contraseña actualizada! Redirigiendo al login...
        </Alert>
      )}
    </Container>
  );
}
