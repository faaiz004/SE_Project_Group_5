import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack
} from "@mui/material";
import { Download, ArrowBack } from "@mui/icons-material";

function WeightPreference() {
  const [shirtSize, setShirtSize] = useState(null);
  const [pantsSize, setPantsSize] = useState(null);
  const [weightClass, setWeightClass] = useState(null);

  const navigate = useNavigate();

  // Load values from sessionStorage if already set
  useEffect(() => {
    const credentials = JSON.parse(sessionStorage.getItem('user-credentials')) || {};

    // If gender isn't set, redirect back to gender step
    if (!credentials.gender) {
      navigate("/preferences/gender");
      return;
    }

    // Pre-fill values if they exist
    if (credentials.shirtSize) setShirtSize(credentials.shirtSize);
    if (credentials.pantSize) setPantsSize(credentials.pantSize);
    if (credentials.weightClass) setWeightClass(credentials.weightClass);
  }, [navigate]);

  const handleShirtSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setShirtSize(newSize);
      updateSession({ shirtSize: newSize });
    }
  };

  const handlePantsSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setPantsSize(newSize);
      updateSession({ pantSize: newSize });
    }
  };

  const handleWeightClassChange = (event, newClass) => {
    if (newClass !== null) {
      setWeightClass(newClass);
      updateSession({ weightClass: newClass });
    }
  };

  const updateSession = (newData) => {
    const current = JSON.parse(sessionStorage.getItem('user-credentials')) || {};
    const updated = { ...current, ...newData };
    sessionStorage.setItem('user-credentials', JSON.stringify(updated));
  };

  const isFormComplete = shirtSize && pantsSize && weightClass;

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
      {/* Top section */}
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

      {/* Step indicator */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ width: "33%" }}>
          <IconButton
            sx={{ color: "#000" }}
            onClick={() => navigate("/preferences/gender")}
          >
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 500, width: "33%" }}
        >
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
            onClick={() => navigate("/preferences/style")}
          >
            Skip
          </Button>
        </Box>
      </Box>

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

          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            We'll use this info to show better <br /> outfit fits for you.
          </Typography>

          {/* Shirt size */}
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
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.15)",
                      color: "#3f51b5",
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ToggleButton value="small">Small</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="large">Large</ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          {/* Pants size */}
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
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.15)",
                      color: "#3f51b5",
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ToggleButton value="small">Small</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="large">Large</ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          {/* Weight class */}
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
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 0,
                    flex: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(63, 81, 181, 0.15)",
                      color: "#3f51b5",
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ToggleButton value="light">Light</ToggleButton>
                <ToggleButton value="average">Average</ToggleButton>
                <ToggleButton value="heavy">Heavy</ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          {/* Navigation buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate("/preferences/gender")}
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
              onClick={() => navigate("/preferences/style")}
              disabled={!isFormComplete}
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
        </Stack>
      </Container>
    </Box>
  );
}

export default WeightPreference;
