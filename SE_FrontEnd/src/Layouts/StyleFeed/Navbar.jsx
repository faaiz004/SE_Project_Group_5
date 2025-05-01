import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with Custom Styles */}
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: '#f0f0f0',
          padding: 1,
        }}
      >
        <Toolbar>
          {/* Swipe-Fit Button */}
          <Typography
                    variant="h4"
                    sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', transition: 'transform .2s', '&:hover': { transform: 'scale(1.03)' }, color: '#000000' }}
                    onClick={() => navigate('/explore')}
                  >
                    Swipe-Fit
                  </Typography>

          {/* Buttons on the Right */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {/* Add Post Button */}
            <IconButton
              sx={{
                color: '#5F65C3',
                mr: 2,
                backgroundColor: 'rgba(95, 101, 195, 0.1)',
                padding: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(95, 101, 195, 0.2)',
                },
              }}
              onClick={() => navigate('/upload-photos')}
            >
              <AddCircleIcon sx={{ fontSize: 32 }} />
            </IconButton>

            {/* Cart Button */}
            <IconButton
              sx={{ color: 'black' }}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCartIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}