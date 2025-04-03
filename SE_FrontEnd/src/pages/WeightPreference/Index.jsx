
import { useState } from "react"
import {
  Box,
  Typography,
  Container,
  Button,
  LinearProgress,
  IconButton,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material"
import { Download, ArrowBack } from "@mui/icons-material"


function WeightPreference() {
  const [shirtSize, setShirtSize] = useState("medium")
  const [pantsSize, setPantsSize] = useState("medium")
  const [weightClass, setWeightClass] = useState("average")

  const handleShirtSizeChange = () => {
    if (newSize !== null) {
      setShirtSize(newSize)
    }
  }

  const handlePantsSizeChange = () => {
    if (newSize !== null) {
      setPantsSize(newSize)
    }
  }

  const handleWeightClassChange = () => {
    if (newClass !== null) {
      setWeightClass(newClass)
    }
  }

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
      {/* Top section with progress, back button, and download */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <LinearProgress
            variant="determinate"
            value={40}
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

      {/* Step indicator and Skip button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ width: "33%" }}>
          <IconButton sx={{ color: "#000", visibility: "hidden" }} aria-label="go back">
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant="h5" align="center" sx={{ fontWeight: 500, width: "33%" }}>
          Step 2 of 5
        </Typography>
        <Box sx={{ width: "33%", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="text"
            sx={{
              color: "#000",
              fontSize: "1.25rem",
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Skip
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" align="center" sx={{ fontWeight: 600 }}>
              Select Your Size
            </Typography>
            <Typography variant="h3" align="center" sx={{ fontWeight: 600 }}>
              Preferences
            </Typography>
          </Box>

          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
            We'll use this info to show better
            <br />
            outfit fits for you.
          </Typography>

          {/* Size selections */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Shirt Size
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <ToggleButtonGroup
                value={shirtSize}
                exclusive
                onChange={handleShirtSizeChange}
                aria-label="shirt size"
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.1)",
                    },
                  },
                }}
              >
                <ToggleButton value="small" aria-label="small">
                  <Typography variant="h6">Small</Typography>
                </ToggleButton>
                <ToggleButton value="medium" aria-label="medium">
                  <Typography variant="h6">Medium</Typography>
                </ToggleButton>
                <ToggleButton value="large" aria-label="large">
                  <Typography variant="h6">Large</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Pants Size
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <ToggleButtonGroup
                value={pantsSize}
                exclusive
                onChange={handlePantsSizeChange}
                aria-label="pants size"
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.1)",
                    },
                  },
                }}
              >
                <ToggleButton value="small" aria-label="small">
                  <Typography variant="h6">Small</Typography>
                </ToggleButton>
                <ToggleButton value="medium" aria-label="medium">
                  <Typography variant="h6">Medium</Typography>
                </ToggleButton>
                <ToggleButton value="large" aria-label="large">
                  <Typography variant="h6">Large</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Weight Class
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <ToggleButtonGroup
                value={weightClass}
                exclusive
                onChange={handleWeightClassChange}
                aria-label="weight class"
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.1)",
                    },
                  },
                }}
              >
                <ToggleButton value="light" aria-label="light">
                  <Typography variant="h6">Light</Typography>
                </ToggleButton>
                <ToggleButton value="average" aria-label="average">
                  <Typography variant="h6">Average</Typography>
                </ToggleButton>
                <ToggleButton value="heavy" aria-label="heavy">
                  <Typography variant="h6">Heavy</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default WeightPreference