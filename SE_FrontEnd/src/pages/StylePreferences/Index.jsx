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
import { fetchOutfits } from "../../api/clothesService";

function StylePreferences() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [styleOptions, setStyleOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const credentials = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    if (credentials.stylePreference) {
      setSelectedStyle(credentials.stylePreference);
    }
    const gender = credentials.gender; // "Male" or "Female"
  
    fetchOutfits()
      .then(data => {
        // Filter by gender
        const genderItems = data.filter(o => o.gender === gender);
        
        // Split into uppers and lowers
        const uppers = genderItems.filter(o => o.upper);
        const lowers = genderItems.filter(o => !o.upper);
        
        // define both the backend category and the display label
        const categoryMap = {
          modern:    { cat: "Modern",            label: "Modern" },
          business:  { cat: "Modern",            label: "Business" },
          oldmoney:  { cat: "Modern/Old_Money",  label: "Old Money" },
          casual:    { cat: "Casual_Everyday",   label: "Casual" },
        };
        
        // Create style options with half uppers, half lowers
        const options = [];
        let upperCount = 0;
        let lowerCount = 0;
        const targetCount = Object.keys(categoryMap).length;
        const halfCount = Math.ceil(targetCount / 2);
        
        Object.entries(categoryMap).forEach(([id, { cat, label }]) => {
          // Decide if this should be upper or lower based on counts
          const useUpper = upperCount < halfCount && (lowerCount >= halfCount || Math.random() < 0.5);
          
          const sourceArray = useUpper ? uppers : lowers;
          const candidates = sourceArray.filter(o => o.category === cat);
          
          const item = candidates.length
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : null;
            
          if (useUpper) upperCount++;
          else lowerCount++;
          
          options.push({
            id,
            label,
            image: item?.signedImageUrl || item?.imageUrl || ""
          });
        });
        
        setStyleOptions(options);
      })
      .catch(console.error);
  }, []);

  const updateSession = (newData) => {
    const current = JSON.parse(sessionStorage.getItem("user-credentials")) || {};
    sessionStorage.setItem(
      "user-credentials",
      JSON.stringify({ ...current, ...newData })
    );
  };

  const handleStyleSelect = (style) => {
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
          {styleOptions.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card elevation={0} sx={{ borderRadius: 2 }}>
                    <Skeleton variant="rectangular" width={250} height={300} />
                    <CardContent>
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : styleOptions.map((style) => (
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
                        alt={style.label}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontWeight: 500 }}
                        >
                          {style.label}
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