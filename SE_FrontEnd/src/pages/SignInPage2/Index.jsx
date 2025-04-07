import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Import style objects from Style.jsx
import {
  pageContainer,
  cardContainer,
  welcomeHeading,
  inputField,
  continueButton,
  forgotPasswordLink,
} from "./Style";

function LoginPage() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if both email and password are filled
  const isFormValid = email !== "" && password !== "";

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Perform login action
      sessionStorage.setItem('user-credentials', JSON.stringify({
        email: email,
        password: password,
      }));
      navigate("/preferences/gender");
    }
  }


  return (
    <Box sx={pageContainer}>
      <Box sx={cardContainer}>
        <Typography sx={welcomeHeading}>Welcome</Typography>

        <TextField
          label="Email address"
          variant="outlined"
          fullWidth
          sx={inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          sx={inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />

        <Button
          variant="contained"
          sx={continueButton}
          onClick={handleSubmit} // Call handleSubmit on button click
          disabled={!isFormValid} // Disable button if form is not valid
        >
          Continue
        </Button>

        <Link href="#" sx={forgotPasswordLink}>
          Forgot Password?
        </Link>
      </Box>
    </Box>
  );
}

export default LoginPage;
