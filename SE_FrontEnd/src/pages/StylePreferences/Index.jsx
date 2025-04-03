import { useState } from "react"
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
} from "@mui/material"


// Import images
import modernImg from "../../assets/StylePreferences/larki1.jpeg"
import businessImg from "../../assets/StylePreferences/larki2.png"
import oldMoneyImg from "../../assets/StylePreferences/larki4.png"
import casualImg from "../../assets/StylePreferences/larki5.png"

function StylePreferences() {
  const [selectedStyle, setSelectedStyle] = useState(null)

  const handleStyleSelect = (style) => {
    setSelectedStyle(style)
  }


  const styleOptions = [
    { id: "modern", name: "Modern", image: modernImg },
    { id: "business", name: "Business", image: businessImg },
    { id: "oldmoney", name: "Old Money", image: oldMoneyImg },
    { id: "casual", name: "Casual", image: casualImg },
  ]

  console.log(styleOptions[0].image)

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
      <Container maxWidth="lg" sx={{ flexGrow: 1}}>
        {/* Title */}
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          Select your style
        </Typography>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          preferences
        </Typography>

        <Grid container spacing={3} sx = {{
            gap: 4,
            width: "100%",
            display: "flex",
            justifyContent: "center",
        }}>
          {styleOptions.map((style, index) => (
            <Grid item xs={12} sm={6} key={style.id}>
              <Card
                elevation={0}
                onClick={() => handleStyleSelect(style.id)}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                  ...(selectedStyle === style.id && {
                    border: "2px solid #3f51b5",
                  }),
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
      </Container>
    </Box>
  )
}

export default StylePreferences