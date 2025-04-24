import React, { useState } from "react"
import axios from "axios"

import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Divider,
  useMediaQuery,
  useTheme,
  Stack,
  LinearProgress,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import {loginConvention} from "../../api/authService"
import { GoogleLogin } from "@react-oauth/google"

export default function LoginPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = email !== "" && password !== ""

  const handleLogin = async () => {
    if (!isFormValid) return

    setError("")
    setIsLoading(true)
    try {
      await loginConvention(email, password)
    } catch (err) {
      const msg = err.response?.data?.error?.includes("Invalid credentials")
        ? "Incorrect email or password."
        : "Internal server error. Please try again."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    // existing Google login logic...
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
          backgroundColor: "#fff",
        }}
      >
        {/* Left side with branding */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            padding: 4,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ maxWidth: 400, ml: { md: 8, lg: 12 } }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { md: "2.75rem", lg: "3.5rem" } }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: "normal",
                fontSize: { md: "1.1rem", lg: "1.25rem" },
              }}
            >
              Enter your credentials to access your account.
            </Typography>
          </Box>
        </Box>

        {/* Right side with login form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            backgroundColor: "#f0f0f0",
          }}
        >
          <Card
            elevation={0}
            sx={{
              maxWidth: 380,
              width: "100%",
              borderRadius: 2,
              py: 2,
              px: { xs: 2, sm: 3 },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Login
              </Typography>

              <Stack spacing={2} mb={1}>
                <TextField
                  fullWidth
                  placeholder="Email address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  fullWidth
                  placeholder="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <Typography variant="body2" color="error" sx={{ fontSize: "0.875rem" }}>
                    {error}
                  </Typography>
                )}
              </Stack>

              <Stack spacing={1.5} mb={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  disabled={!isFormValid || isLoading}
                  sx={{
                    py: 1.25,
                    backgroundColor: "#141b41",
                    "&:hover": { backgroundColor: "#0d1232" },
                    borderRadius: 1,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Login
                </Button>

                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => console.log("Google login failed")}
                  width="100%"
                />
              </Stack>

              <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
                <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                  Forgot password?
                </Link>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link href="/sign-up" underline="hover" color="primary" fontWeight="medium">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
