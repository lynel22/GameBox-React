import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Chip,
  Tooltip,
  Button,
  ButtonGroup,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getDeals } from "../api/game";
import storeLogos from "../constants/storelogos";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    getDeals()
      .then((res) => setDeals(res.data))
      .catch((err) => console.error("Error cargando ofertas:", err));
  }, []);

  const handleSort = (key) => {
    setSortBy((prev) => (prev === key ? null : key));
  };

  const sortedDeals = [...deals].sort((a, b) => {
    if (sortBy === "title") return a.gameTitle.localeCompare(b.gameTitle);
    if (sortBy === "savings") return b.savings - a.savings;
    return 0;
  });

  return (
    <Box sx={{ mt: 2, px: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, textAlign: "left" }}>
        Ofertas destacadas
      </Typography>

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
          {deals.length} ofertas disponibles
        </Typography>

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
              className={sortBy === "savings" ? "active" : ""}
              onClick={() => handleSort("savings")}
            >
              Ahorro
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {sortedDeals.map((deal, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <a
              href={deal.dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  bgcolor: "#2a2a2a",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  position: "relative",
                  height: 110,
                  width: "100%",
                  maxWidth: 570,
                  minWidth: 570,
                  mx: "auto",
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  component="img"
                  image={deal.gameImageUrl || "/default-image.jpg"}
                  alt={deal.gameTitle}
                  sx={{
                    width: 100,
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ flex: 1, p: 2, textAlign: "left" }}>
                  <Link
                    to={`/game/${deal.gameId}`}
                    style={{ textDecoration: "none" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        fontSize: "1.1rem",
                        color: "white",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "white",
                        },
                      }}
                    >
                      {deal.gameTitle}
                    </Typography>
                  </Link>

                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      position: "absolute",
                      bottom: 20,
                      right: 100,
                    }}
                  >
                    {storeLogos[deal.storeName] && (
                      <Tooltip title={deal.storeName}>
                        <img
                          src={storeLogos[deal.storeName]}
                          alt={deal.storeName}
                          style={{ width: 24, height: 24 }}
                        />
                      </Tooltip>
                    )}
                    <Chip
                      label={`-${Math.round(deal.savings)}%`}
                      size="small"
                      sx={{ bgcolor: "#3a3a3a", color: "limegreen" }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#1b1b1b",
                    minWidth: 90,
                  }}
                >
                  <Typography variant="h6" color="limegreen">
                    -{Math.round(deal.savings)}%
                  </Typography>
                  <Typography color="white">
                    {parseFloat(deal.salePrice).toFixed(2)}€
                  </Typography>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      fontSize: "0.8rem",
                      color: "#aaa",
                    }}
                  >
                    {parseFloat(deal.normalPrice).toFixed(2)}€
                  </Typography>
                </Box>
              </Box>
            </a>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
