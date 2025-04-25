import React, { useState } from "react";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/authService";

import {
  pageContainer,
  leftContainer,
  rightContainer,
  title,
  subtitle,
  collageContainer,
  collageImage1,
  collageImage2,
  collageImage3,
  collageImage4,
  collageImage5,
  mannequinImage,
  buttonContainer,
  signInButton,
  googleButton,
} from "./Style";

import mannequin from "../../assets/SignInPage/mannequin.png";
import girl1 from "../../assets/SignInPage/larki1.jpeg";
import girl2 from "../../assets/SignInPage/larki2.png";
import girl3 from "../../assets/SignInPage/larki3.png";
import girl4 from "../../assets/SignInPage/larki4.png";
import girl5 from "../../assets/SignInPage/larki5.png";

function Collage() {
  return (
    <Box sx={collageContainer}>
      <Box component="img" src={girl1} alt="Girl 1" sx={collageImage1} />
      <Box component="img" src={girl2} alt="Girl 2" sx={collageImage2} />
      <Box component="img" src={girl3} alt="Girl 3" sx={collageImage3} />
      <Box component="img" src={girl4} alt="Girl 4" sx={collageImage4} />
      <Box component="img" src={girl5} alt="Girl 5" sx={collageImage5} />
    </Box>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const googleToken = credentialResponse.credential;
      await loginWithGoogle(googleToken);

      const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';
      if (preferencesCompleted) {
        navigate("/explore");
      } else {
        navigate("/preferences/gender");
      }
    } catch (error) {
      console.error("Google login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google login failed");
  };

  return (
    <Box sx={pageContainer}>
      {isLoading && (
        <LinearProgress
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000 }}
        />
      )}

      <Box sx={leftContainer}>
        <Collage />
      </Box>

      <Box sx={rightContainer}>
        <Typography component="h1" sx={title}>
          Welcome To Swipe-FIT
        </Typography>
        <Typography component="h2" sx={subtitle}>
          Swipe. Style. Shop. – Your Virtual Fitting Room Experience!
        </Typography>

        <Box component="img" src={mannequin} alt="Wooden Mannequin" sx={mannequinImage} />

        <Box sx={buttonContainer}>
          <Button variant="contained" sx={signInButton} onClick={() => navigate("/sign-up")}>
            Sign Up
          </Button>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            render={(renderProps) => (
              <Button
                variant="contained"
                sx={googleButton}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Continue with Google
              </Button>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
