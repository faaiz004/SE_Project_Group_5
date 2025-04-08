import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';

// Import your style objects
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

// Import your images (adjust paths as needed)
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

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      console.log("Received Google token:", googleToken);

      // Send this Google token to your backend for verification via the updated route
      const response = await axios.post(
        'http://localhost:8000/api/auth/google',  // Updated URL
        { token: googleToken },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Extract your app's token and user information
      const { token, user } = response.data;
      if (token) {
        // Save your JWT in local storage
        localStorage.setItem('jwt', token);
      }
      
      console.log("Backend response:", response.data);
      navigate("/preferences/gender"); // Proceed as needed
    } catch (error) {
      console.error("Google login error:", error.response?.data || error.message);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google login failed");
    // Handle error display as needed
  };

  return (
    <Box sx={pageContainer}>
      {/* Left side with overlapping collage images */}
      <Box sx={leftContainer}>
        <Collage />
      </Box>

      {/* Right side with sign-up text, mannequin image, and buttons */}
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
