import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  LinearProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import modernImg from "../../assets/StylePreferences/larki1.jpeg";
import businessImg from "../../assets/StylePreferences/larki2.png";
import oldMoneyImg from "../../assets/StylePreferences/larki4.png";
import casualImg from "../../assets/StylePreferences/larki5.png";

function StylePreferences() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const credentials = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    if (credentials.stylePreference) {
      setSelectedStyle(credentials.stylePreference);
    }
  }, []);

  const updateSession = (newData) => {
    const current = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    const updated = { ...current, ...newData };
    sessionStorage.setItem("user-credentials", JSON.stringify(updated));
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    updateSession({ stylePreference: style });
  };

  const styleOptions = [
    { id: "modern", name: "Modern", image: modernImg },
    { id: "business", name: "Business", image: businessImg },
    { id: "oldmoney", name: "Old Money", image: oldMoneyImg },
    { id: "Casual", name: "Casual", image: casualImg },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        pt: 3,
        px: 2,
        width: "100%",
      }}
    >
      {/* Progress bar */}
      <Box sx={{ px: 2, mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={60}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#3f51b5",
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Step indicator */}
      <Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
        Step 3 of 5
      </Typography>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          Select your style
        </Typography>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          preferences
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            gap: 4,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {styleOptions.map((style) => (
            <Grid item xs={12} sm={6} md={4} key={style.id}>
              <Card
                elevation={0}
                onClick={() => handleStyleSelect(style.id)}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border:
                    selectedStyle === style.id
                      ? "2px solid #3f51b5"
                      : "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={style.image}
                    alt={style.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
                      {style.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Navigation buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={6}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/preferences/weight")}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: "#3f51b5",
              color: "#3f51b5",
              "&:hover": {
                borderColor: "#303f9f",
                backgroundColor: "rgba(63, 81, 181, 0.04)",
              },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/preferences/shirts")}
            disabled={!selectedStyle}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              "&.Mui-disabled": {
                backgroundColor: "#c5cae9",
                color: "#9fa8da",
              },
            }}
          >
            Next
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default StylePreferences;
