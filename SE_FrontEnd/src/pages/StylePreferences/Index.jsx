// src/pages/Preferences/StylePreferences.jsx
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
  Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sampleClothes } from "../../api/clothesService";

export default function StylePreferences() {
  const navigate = useNavigate();
  const styleOptions = [
    { id: "Modern",           name: "Modern"    },
    { id: "Smart_Casual",     name: "Business"  },
    { id: "Old_Money",        name: "Old Money" },
    { id: "Casual_Everyday",  name: "Casual"    }
  ];

  const [selectedStyle, setSelectedStyle] = useState(null);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  // load existing selection + fetch one sample image per style category
  useEffect(() => {
    const creds = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    if (creds.stylePreference) {
      setSelectedStyle(creds.stylePreference);
    }
  
    (async () => {
      try {
        const gender = creds.gender || "male";
        const categories = styleOptions.map(opt => opt.id);
        const data = await sampleClothes({
          count: 1,
          categories,
          gender,
          upper: true
        });
        const imgs = {};
        data.forEach(group => {
          let raw = group.items[0]?.imageUrl || "";
          if (gender === "male") {
            raw = raw.replace("/thumbnails/thumbnails/", "/thumbnails/");
          }
          imgs[group.category] = raw;
        });
        setImages(imgs);
      } catch (err) {
        console.error("Failed to fetch style previews:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  

  const updateSession = newData => {
    const current = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    sessionStorage.setItem(
      "user-credentials",
      JSON.stringify({ ...current, ...newData })
    );
  };

  const handleStyleSelect = style => {
    setSelectedStyle(style);
    updateSession({ stylePreference: style });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        pt: 3,
        px: 2
      }}
    >
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
              borderRadius: 4
            }
          }}
        />
      </Box>

      <Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
        Step 3 of 5
      </Typography>

      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          Select your style
        </Typography>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          preferences
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {loading
            ? styleOptions.map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                  <Skeleton sx={{ mt: 1, width: "300px" }} />
                </Grid>
              ))
            : styleOptions.map(style => (
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
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transform: "translateY(-4px)"
                      }
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="300"
                        image={images[style.id] || ""}
                        alt={style.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                          {style.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
        </Grid>

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
                backgroundColor: "rgba(63, 81, 181, 0.04)"
              }
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
                backgroundColor: "#303f9f"
              },
              "&.Mui-disabled": {
                backgroundColor: "#c5cae9",
                color: "#9fa8da"
              }
            }}
          >
            Next
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
