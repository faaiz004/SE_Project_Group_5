"use client"
import React, { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from "@mui/material"
import { Email, Lock, ArrowForward, Palette, Brush, Style } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { signupUser } from "../../api/authService" 

export default function SignUp() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = email !== "" && password !== ""

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    setError("")
    setIsLoading(true)
    try {
      await signupUser({ email, password })
      navigate("/preferences/gender")
    } catch (err) {
      const msg = err.response?.data?.error === "Email already registered."
        ? "Email already registered."
        : "Internal server error. Please try again."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      {isLoading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
          }}
        />
      )}

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e0e0e0",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1000,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          {/* Left side with branding */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "#1a237e",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Palette fontSize="large" />
              <Typography variant="h6">Swipe Fit</Typography>
            </Box>

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Discover Your
                <Box component="span" sx={{ color: "#e0e0e0" }}>
                  {" "}Unique Style
                </Box>
              </Typography>

              <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                Join our community of fashion enthusiasts and find inspiration for your next look.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Brush sx={{ color: "#e0e0e0" }} />
                  <Typography variant="body2">Personalized recommendations</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Style sx={{ color: "#e0e0e0" }} />
                  <Typography variant="body2">Trending collections</Typography>
                </Box>
              </Box>
            </Box>

            {/* Background glow circles */}
            <Box
              sx={{
                position: "absolute",
                bottom: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(220,237,255,0.3) 0%, rgba(220,237,255,0) 70%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(220,237,255,0.2) 0%, rgba(220,237,255,0) 70%)",
              }}
            />
          </Box>

          {/* Right side: Signup Form */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "white",
            }}
          >
            <Card elevation={0} sx={{ backgroundColor: "transparent" }}>
              <CardContent>
                <Typography variant="h4" align="center" gutterBottom fontWeight="500">
                  Welcome
                </Typography>

                <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
                      {error}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      backgroundColor: "#1a237e",
                      "&:hover": {
                        backgroundColor: "#0d1442",
                      },
                    }}
                    endIcon={<ArrowForward />}
                    disabled={!isFormValid || isLoading}
                  >
                    CONTINUE
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Link href="#" underline="hover" color="text.secondary">
                      Forgot password?
                    </Link>
                  </Box>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <Link href="/sign-in" underline="hover" color="primary" fontWeight="medium">
                        Log in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
