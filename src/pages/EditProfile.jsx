import { useState, useEffect } from "react";
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
  Avatar,
  FormControl,
  OutlinedInput,
  InputLabel
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { MAX_IMAGE_FILE_SIZE } from "../constants";
import placeholderImg from "../assets/imgs/profile_placeholder.jpg";

import { updateProfile, getCurrentUser } from "../api/user"; // <-- Asume que tienes estas funciones

export default function EditProfile() {
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

  useEffect(() => {
    // Carga datos del usuario actual
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const user = res.data;
        setFormData({
          username: user.username,
          email: user.email,
          password: "" // Vacío para no mostrar la actual
        });
        console.log("Avatar URL:", user.imageUrl);
        if (user.imageUrl) {
          console.log("Setting avatar preview:", user.imageUrl);
          setAvatarPreview(import.meta.env.VITE_API_URL + user.imageUrl);
        }
      } catch (err) {
        setError("No se pudo cargar el perfil del usuario.");
      }
    };

    fetchUser();
  }, []);

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
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (avatar && avatar.size > MAX_IMAGE_FILE_SIZE) {
      setError("La imagen supera el tamaño máximo de 2MB.");
      return;
    }

    const isValid = await validateForm();
    if (!isValid) return;

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    if (avatar) data.append("avatar", avatar);

    try {
      await updateProfile(data);
      setSuccess("Perfil actualizado correctamente.");
      setError("");
    } catch (err) {
      setError("Error al actualizar el perfil.");
      setSuccess("");
    }
  };

  const validateForm = async () => {
    try {
      await profileSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      setError(err.inner?.[0]?.message || "Datos inválidos");
      return false;
    }
  };

  const profileSchema = yup.object().shape({
    username: yup
      .string()
      .required("El nombre de usuario es obligatorio"),
  
    email: yup
      .string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
  
      password: yup
      .string()
      .notRequired()
      .test(
        'password-conditional-validation',
        'La contraseña debe tener al menos 8 caracteres, una letra y un número',
        function (value) {
          if (!value) return true; // Si está vacío, es válido
          const hasMinLength = value.length >= 8;
          const hasLetter = /[A-Za-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          return hasMinLength && hasLetter && hasNumber;
        })
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={20} sx={{ padding: 4 }}>
        <Typography variant="h5" mb={2}>Editar Perfil</Typography>
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
                Cambiar Foto
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
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password">Nueva Contraseña (opcional)</InputLabel>
            <OutlinedInput
              id="password"
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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nueva Contraseña (opcional)"
            />
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Guardar Cambios
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
