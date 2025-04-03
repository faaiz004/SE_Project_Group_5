import { useEffect, useState } from "react"
import { Box, Typography, Card, LinearProgress, Container, Grid, IconButton, Stack } from "@mui/material"
import { Man, Woman, ThumbUp, ThumbDown, Download } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
export default function GenderPreference() {
    const [selectedGender, setSelectedGender] = useState(null)
    const navigate = useNavigate()
    const handleSelectGender = (gender) => {
        setSelectedGender(gender)
    }

    useEffect(() => {
        if (selectedGender) {
            // Navigate to the next step in the process
            navigate("/preferences/weight")
        }
    }, [selectedGender])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e0e0e0, #f5f5f5)",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Top section with progress and download */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={20}
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
        <IconButton>
          <Download />
        </IconButton>
      </Box>

      {/* Step indicator */}
      <Typography variant="h5" align="center" sx={{ mb: 6, fontWeight: 500 }}>
        Step 1 of 5
      </Typography>

      {/* Main content */}
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          Select your gender
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleSelectGender("male")}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                border: selectedGender === "male" ? "2px solid #3f51b5" : "1px solid #e0e0e0",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box sx={{ fontSize: 120, color: "#1a2138", mb: 2 }}>
                <Man sx={{ fontSize: "inherit" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                Male
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleSelectGender("female")}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                border: selectedGender === "female" ? "2px solid #3f51b5" : "1px solid #e0e0e0",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box sx={{ fontSize: 120, color: "#1a2138", mb: 2 }}>
                <Woman sx={{ fontSize: "inherit" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                Female
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Rating section */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mt: "auto", pt: 4 }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Rate this image
        </Typography>
        <Box>
          <IconButton sx={{ color: "white" }}>
            <ThumbUp fontSize="large" />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <ThumbDown fontSize="large" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  )
}

