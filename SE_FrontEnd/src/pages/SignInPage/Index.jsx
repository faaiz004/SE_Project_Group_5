// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

// Import your images (adjust these paths if necessary)
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

function SignInPage() {
  const navigate = useNavigate(); // Initialize useNavigate hook
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
          {/* When Sign Up is clicked, navigate to /sign-in2 */}
          <Button variant="contained" sx={signInButton} onClick={() => navigate("/sign-up")}>
            Sign Up
          </Button>
          <Button variant="contained" sx={googleButton}>
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SignInPage;