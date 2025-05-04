import { useState } from "react"
import {
  Box,
  Typography,
  Container,
  LinearProgress,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Button,
  Snackbar,
  Alert,
  Stack,
  Chip,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useNavigate } from "react-router-dom"
import modernImg from "../../assets/StylePreferences/larki1.jpg"
import businessImg from "../../assets/StylePreferences/larki2.png"
import oldMoneyImg from "../../assets/StylePreferences/larki4.png"
import casualImg from "../../assets/StylePreferences/larki5.png"

function PreferencesShirts() {
  const [selectedShirts, setSelectedShirts] = useState([])
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const shirtImages = [modernImg, businessImg, oldMoneyImg, casualImg]

  const shirts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: `Shirt ${i + 1}`,
    image: shirtImages[i % shirtImages.length],
  }))

  const handleShirtSelect = (shirtId) => {
    if (selectedShirts.includes(shirtId)) {
      setSelectedShirts((prev) => prev.filter((id) => id !== shirtId))
    } else {
      if (selectedShirts.length < 3) {
        setSelectedShirts((prev) => [...prev, shirtId])
      } else {
        setShowError(true)
      }
    }
  }

  const handleCloseError = (_, reason) => {
    if (reason === "clickaway") return
    setShowError(false)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        pt: 3,
        px: 2,
        pb: 6,
      }}
    >
      <Box sx={{ px: 2, mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={80}
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

      <Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
        Step 4 of 5
      </Typography>

      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          Select 3 Shirts
        </Typography>

        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Pick the shirts that align with your personal style. Choose exactly 3 to continue.
        </Typography>

        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Chip
            label={`${selectedShirts.length} of 3 selected`}
            color={selectedShirts.length === 3 ? "primary" : "default"}
            sx={{ mb: 3 }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
        {shirts.map((shirt) => (
          <Grid item xs={12} sm={6} md={4} key={shirt.id}>
            <Card
              elevation={0}
              onClick={() => handleShirtSelect(shirt.id)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: selectedShirts.includes(shirt.id)
                  ? "2px solid #3f51b5"
                  : "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                minHeight: 280,
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image={shirt.image}
                  alt={shirt.name}
                  sx={{ objectFit: "cover", width: "100%" }}
                />
                {selectedShirts.includes(shirt.id) && (
                  <CheckCircleIcon
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: "#3f51b5",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      fontSize: 28,
                    }}
                  />
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 6 }}
        >
          <Button
            variant="outlined"
            size="large"
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
            onClick={() => {
                navigate('/preferences/style')
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={selectedShirts.length !== 3}
            onClick={() => {
                navigate("/preferences/pants")
            }}
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

      {}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          You can only select 3 shirts.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PreferencesShirts
