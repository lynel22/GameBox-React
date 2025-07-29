import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Chip,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRecommendations } from "../api/game";
import storeLogos from "../constants/storelogos"; // Usamos logos locales

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRecommendations()
      .then((res) => {
        setRecommendations(res.data);
        console.log("Weekly Recommendations:", res.data);
      })
      .catch((err) => {
        console.error("Error loading recommendations:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const goToGame = (id) => navigate(`/games/${id}`);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="h4" color="white" gutterBottom mb={3}>
        Recomendaciones semanales
      </Typography>
      {recommendations.length === 0 ? (
        <Typography color="gray">No hay recomendaciones esta semana.</Typography>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((rec) => (
            <Grid item xs={12} md={6} key={rec.gameId}>
              <Box
                bgcolor="#2a2a2a"
                borderRadius={4}
                p={2}
                sx={{
                  cursor: "pointer",
                  transition: "0.3s",
                  ":hover": { boxShadow: 6 },
                  height: "100%",
                  alignItems: "center",
                }}
                onClick={() => navigate(`/game/${rec.gameId}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={rec.imageUrl}
                  alt={rec.title}
                  sx={{ borderRadius: 2, objectFit: "cover", mb: 1, width: "350px" }}
                />
                <Typography variant="h6" color="white" noWrap title={rec.title}>
                  {rec.title}
                </Typography>
                <Typography variant="body2" color="gray" gutterBottom>
                  Recomendado por tu interés en:{" "}
                  <strong>{rec.genreRecommendedBy?.spanishName || rec.genreRecommendedBy?.name}</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={0.5} mt={1} mb={1}>
                  {rec.genres.map((g) => (
                    <Chip
                      key={g.id}
                      size="small"
                      label={g.spanishName || g.name}
                      sx={{
                        bgcolor: "#212121ff",
                        color: "white",
                        fontSize: "0.8rem",
                      }}
                    />
                  ))}
                </Box>
                <Box display="flex" justifyContent="center" gap={1} mt={1}>
                  {rec.stores.map((store) => (
                    <Tooltip title={store.name} key={store.id}>
                      <img
                        src={storeLogos[store.name] || "/default-store.png"}
                        alt={store.name}
                        style={{ width: 24, height: 24, borderRadius: 4 }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecommendationsPage;
