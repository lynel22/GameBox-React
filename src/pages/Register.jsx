import { useState } from "react";
import * as yup from "yup";
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
import { MAX_IMAGE_FILE_SIZE } from "../constants";
import placeholderImg from "../assets/imgs/profile_placeholder.jpg";


import { register } from "../api/auth";

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

    // Validación del tamaño del avatar
    if (avatar && avatar.size > MAX_IMAGE_FILE_SIZE) {
      setError("El tamaño máximo permitido para la imagen es de 2MB.");
      setSuccess("");
      return;
    }

    // Validación del formulario
    const isValid = await validateForm();
    if (!isValid) {
      setSuccess("");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (avatar) data.append("avatar", avatar);

    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const res = await register(data);
      setSuccess("¡Registro completado! Revisa tu correo para activar tu cuenta.");
      setError("");
    } catch (err) {
      const errorMessage = await err.response?.data || "Error desconocido al registrar usuario, inténtelo más tarde.";
      setError(errorMessage);
      setSuccess("");
    }
  };

  const validateForm = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      if (err.inner && err.inner.length > 0) {
        setError(err.inner[0].message);
      } else {
        setError("Datos inválidos");
      }
      return false;
    }
  };

  const registerSchema = yup.object().shape({
    username: yup
      .string()
      .required("El nombre de usuario es obligatorio"),
  
    email: yup
      .string()
      .email("El correo electrónico no es válido")
      .required("El correo electrónico es obligatorio"),
  
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres, con un mínimo de 1 letra y 1 número")
      .matches(/[A-Za-z]/, "La contraseña debe tener al menos 8 caracteres, con un mínimo de 1 letra y 1 número")
      .matches(/[0-9]/, "La contraseña debe tener al menos 8 caracteres, con un mínimo de 1 letra y 1 número")
  });


  return (
    <Container maxWidth="sm">
      <Paper elevation={20} sx={{ padding: 4 }}>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box display="flex" alignItems="end" gap={2} marginTop={2} marginBottom={2}>
                <Avatar
                    alt="Avatar de usuario"
                    src={avatarPreview || placeholderImg}
                    sx={{ width: 100, height: 100 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="avatar-upload">
                  <Button variant="contained" component="span" color="primary">
                    Subir Foto de Perfil
                  </Button>
                </label>
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
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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
