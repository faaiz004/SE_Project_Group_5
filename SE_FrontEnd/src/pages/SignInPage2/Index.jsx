import React from "react";
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
  return (
    <Box sx={pageContainer}>
      <Box sx={cardContainer}>
        <Typography sx={welcomeHeading}>Welcome</Typography>

        <TextField
          label="Email address"
          variant="outlined"
          fullWidth
          sx={inputField}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          sx={inputField}
        />

        <Button variant="contained" sx={continueButton} onClick={() => navigate("/explore")}>
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