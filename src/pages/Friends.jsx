import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Avatar,
} from "@mui/material";
import {
  getFriendCode,
  searchFriendByCode,
  addFriend,
  getUserFriends,
} from "../api/friends";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAuth } from "../context/AuthContext";

export default function Friends() {
  const { user } = useAuth(); // ← obtenemos el usuario autenticado
  const [friendCode, setFriendCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchFriendCode();
      fetchFriends();
    }
  }, [user]);

  const fetchFriendCode = async () => {
    try {
      const res = await getFriendCode();
      setFriendCode(res.data);
    } catch (err) {
      console.error("Error al obtener el código:", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await getUserFriends(user.id);
      console.log("Friends response:", res);
      setFriends(res.data);
    } catch (err) {
      console.error("Error al cargar amigos:", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await searchFriendByCode(inputCode);
      setSearchResult(res.data);
    } catch (err) {
      console.error("Error al buscar amigo:", err);
      setSearchResult(null);
    }
  };

  const handleAddFriend = async (id) => {
    try {
      await addFriend(id);
      fetchFriends(); 
      setSearchResult(null);
    } catch (err) {
      console.error("Error al añadir amigo:", err);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ mt: 2, px: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
        Amigos
      </Typography>

      {/* Código de amigo */}
      <Box
        sx={{
          bgcolor: "#1b3d4e",
          p: 3,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ color: "#ccc" }}>
            Tu código de amigo
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              mt: 1,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            {friendCode}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigator.clipboard.writeText(friendCode)}
        >
          Copiar
        </Button>
      </Box>

      {/* Buscador */}
      <Typography sx={{ color: "#ccc", mb: 1 }}>
        Introduce el código de amigo para enviar una invitación.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Introduce un código de amigo"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          fullWidth
          InputProps={{
            style: { backgroundColor: "#2a2a2a", color: "white" },
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>

      {/* Resultado de búsqueda */}
      {searchResult && (
        <Card
          sx={{
            bgcolor: "#2a2a2a",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={import.meta.env.VITE_API_URL + user.imageUrl} alt={searchResult.username} />
            <Typography color="white">{searchResult.username}</Typography>
          </Box>
          <Button
            startIcon={<PersonAddAltIcon />}
            variant="contained"
            onClick={() => handleAddFriend(searchResult.id)}
          >
            Añadir amigo
          </Button>
        </Card>
      )}

      {/* Lista de amigos */}
      <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
        Tus amigos
      </Typography>
      {friends.length === 0 ? (
        <Typography sx={{ color: "#aaa" }}>
          No tienes amigos añadidos todavía.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {friends.map((f) => (
            <Card
              key={f.id}
              sx={{
                bgcolor: "#2a2a2a",
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
                width: "calc(50% - 16px)", // 16px = gap
              }}
            >
              <Avatar
                src={import.meta.env.VITE_API_URL + f.imageUrl}
                alt={f.username}
                sx={{ width: 65, height: 65 }}
              />
              <Typography color="white" sx={{ fontSize: "1.3rem", ml: 1 }}>{f.username}</Typography>
            </Card>
          ))}
        </Box>
      )}

    </Box>
  );
}
