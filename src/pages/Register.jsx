import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';


import { register } from "../api/auth"; // Suponiendo que tienes una función register

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Esto genera un preview temporal
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (avatar) data.append("avatar", avatar);

    try {
        const res = await register(data); 
        setSuccess("¡Registro completado! Revisa tu correo para activar tu cuenta.");
        setError("");
    } catch (err) {
        setError("Error al registrar usuario.");
        setSuccess("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={20} sx={{ padding: 4 }}>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box display="flex" alignItems="end" gap={2} marginTop={2} marginBottom={2}>
                <Avatar
                    alt="Avatar de usuario"
                    src={avatarPreview || "https://via.placeholder.com/150"}
                    sx={{ width: 100, height: 100 }}
                />
                <input paddingBottom={2}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
            </Box>

          <TextField
            margin="normal"
            fullWidth
            required
            name="username"
            label="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            name="email"
            type="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel htmlFor="formData.password">Contraseña</InputLabel>
            <OutlinedInput
              id="formData.password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
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
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
