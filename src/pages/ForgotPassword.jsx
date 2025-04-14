import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/verify/password?email=${email}`);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error?.response?.data || "Algo salió mal");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 0, textAlign: "center"}}>
      <Typography variant="h4" gutterBottom>
        Restablecer contraseña
      </Typography>
      <Typography variant="body1" gutterBottom>
        Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth style={{ marginTop: 20 }}>
          Enviar enlace de restablecimiento
        </Button>
      </form>

      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Si el correo está registrado, se enviará un enlace para restablecer la contraseña.
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
}
