import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: '#f0f0f0',
          padding: 1
        }}
      >
        <Toolbar>
        <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2, color: 'black' }} // Set icon color to black
      >
        <MenuIcon sx={{ fontSize: 32 }} /> {/* Increase the size of the icon */}
      </IconButton>
          <Typography
            sx={{ flexGrow: 1, color: 'black', fontSize: 30, fontFamily: 'sans-serif', fontWeight: 700 }} // Set text color to black
          >
            Swipe-Fit
          </Typography>
          <Button sx={{ color: 'black', fontSize: 18, fontWeight: 300, paddingRight: 5  }}>Explore</Button> {/* Set button text color to black */}
          <Button sx={{ color: 'black', fontSize: 18, fontWeight: 300 , paddingRight: 5 }}>Shopping-Cart</Button> {/* Set button text color to black */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}