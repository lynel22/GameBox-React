import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Chip,
  Tooltip,
  Button,
  ButtonGroup,
} from "@mui/material";
import { getUserWishlist, removeGameFromWishlist } from "../api/game";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
import storeLogos from "../constants/storelogos";

dayjs.locale("es");

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = () => {
    getUserWishlist()
      .then((res) => setWishlist(res.data))
      .catch((err) => console.error("Error cargando wishlist:", err));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleSort = (key) => {
    setSortBy((prev) => (prev === key ? null : key));
  };

  const sortedWishlist = [...wishlist].sort((a, b) => {
    if (sortBy === "title") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "dateAdded") {
      return new Date(b.fechaAdicion) - new Date(a.fechaAdicion);
    } else if (sortBy === "price") {
      const priceA = a.deals && a.deals.length > 0
        ? Math.min(...a.deals.map((d) => d.salePrice))
        : Infinity;
      const priceB = b.deals && b.deals.length > 0
        ? Math.min(...b.deals.map((d) => d.salePrice))
        : Infinity;
      return priceA - priceB;
    } else {
      return 0;
    }
  });


  const handleRemove = async (gameId) => {
    try {
      await removeGameFromWishlist(gameId);
      fetchWishlist();
    } catch (error) {
      console.error("Error al eliminar de la wishlist:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, px: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "left", fontWeight: 500 }}>
        Lista de deseados
      </Typography>

      {/* Subheader con contador y filtros */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#aaa" }}>
          {wishlist.length} juegos guardados
        </Typography>

        {/* Ordenar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "#888" }}>
            Ordenar:
          </Typography>
          <ButtonGroup className="button-group-dark">
            <Button
              className={sortBy === "title" ? "active" : ""}
              onClick={() => handleSort("title")}
            >
              Alfabético
            </Button>
            <Button
              className={sortBy === "dateAdded" ? "active" : ""}
              onClick={() => handleSort("dateAdded")}
            >
              Fecha añadida
            </Button>
            <Button
              className={sortBy === "price" ? "active" : ""}
              onClick={() => handleSort("price")}
            >
              Precio
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {sortedWishlist.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            flexDirection: "row",
            bgcolor: "#2a2a2a",
            borderRadius: 2,
            mb: 3,
            overflow: "hidden",
            boxShadow: 2,
            position: "relative",
          }}
        >
          <CardMedia
            component="img"
            image={item.imageUrl || "/default-image.jpg"}
            alt={item.name}
            sx={{
              width: 300,
              height: "auto",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/game/${item.id}`)}
          />

          <Box sx={{ flex: 1, p: 2, position: "relative" }}>
            <Typography
              variant="h6"
              color="white"
              sx={{
                textAlign: "left",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate(`/game/${item.id}`)}
            >
              {item.name}
            </Typography>

            <Typography sx={{ color: "#aaa", mt: 1, textAlign: "left" }}>
              Fecha de lanzamiento:{" "}
              <strong>{dayjs(item.releaseDate).format("D/M/YYYY")}</strong>
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                textAlign: "left",
              }}
            >
              {item.genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.spanishName || g.name}
                  size="small"
                  sx={{ bgcolor: "#3a3a3a", color: "#fff" }}
                />
              ))}
            </Box>

            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.85rem", textAlign: "left" }}>
                Añadido el {dayjs(item.fechaAdicion).format("D/M/YYYY")}
              </Typography>
              <Typography
                onClick={() => handleRemove(item.id)}
                sx={{
                  color: "#ccc",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#fff",
                    textDecoration: "underline",
                  },
                }}
              >
                Eliminar
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                right: 20,
                display: "flex",
                gap: 1,
              }}
            >
              {item.stores?.map((store) => {
                const logo = storeLogos[store.name];
                return logo ? (
                  <Tooltip title={store.name} key={store.id}>
                    <img
                      src={logo}
                      alt={store.name}
                      style={{ width: 24, height: 24 }}
                    />
                  </Tooltip>
                ) : null;
              })}
            </Box>
          </Box>

          <Box
            sx={{
              px: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#1b1b1b",
              minWidth: 120,
            }}
          >
            {item.deals && item.deals.length > 0 ? (
              (() => {
                const bestDeal = item.deals.reduce((min, deal) =>
                  deal.salePrice < min.salePrice ? deal : min
                );
                const discount = Math.round(
                  (1 - bestDeal.salePrice / bestDeal.normalPrice) * 100
                );
                return (
                  <>
                    <Typography variant="h6" color="limegreen">
                      -{discount}%
                    </Typography>
                    <Typography color="white">
                      {bestDeal.salePrice.toFixed(2)}€
                    </Typography>
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        fontSize: "0.8rem",
                        color: "#aaa",
                      }}
                    >
                      {bestDeal.normalPrice.toFixed(2)}€
                    </Typography>
                  </>
                );
              })()
            ) : (
              <Typography color="gray">Sin ofertas</Typography>
            )}
          </Box>

        </Box>
      ))}
    </Box>
  );
}
