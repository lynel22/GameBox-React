import { useState } from "react";
import React from "react";
import { useSnackbar } from 'notistack';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton ,
  InputAdornment
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { Link } from "react-router-dom";


import { login } from "../api/auth"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      await login({ username, password });

      // Redireccionar a dashboard o lo que toque
      window.location.href = "/";
    }catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data;
  
      if (status === 403) {
        enqueueSnackbar("Tu cuenta no está activada. Por favor revisa tu correo.", { variant: "error" });
      } else if (status === 401) {
        enqueueSnackbar("Correo o contraseña incorrectos.", { variant: "error" });
      } else {
        enqueueSnackbar("Ha ocurrido un error inesperado. Intenta de nuevo más tarde.", { variant: "error" });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={2} sx={{ padding: 4, mt: 8}}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Inicio de Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            fullWidth
            required
            label="Correo electrónico"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
            />
          </FormControl>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿Aún no tienes una cuenta? Regístrate{" "}
            <Link to="/register" style={{textDecoration: "none", cursor: "pointer" }}>
              aquí
            </Link>
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
