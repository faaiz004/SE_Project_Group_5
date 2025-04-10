import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
          padding: 1
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: 'black' }}
          >
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography
            sx={{ flexGrow: 1, color: 'black', fontSize: 30, fontFamily: 'sans-serif', fontWeight: 700 }}
          >
            Swipe-Fit
          </Typography>
          
          {/* Add Post Button - More Prominent */}
          <IconButton 
            sx={{ 
              color: '#5F65C3', 
              mr: 2,
              backgroundColor: 'rgba(95, 101, 195, 0.1)', 
              padding: 1.2,
              '&:hover': {
                backgroundColor: 'rgba(95, 101, 195, 0.2)',
              }
            }}
            onClick={() => navigate('/upload-photos')}
          >
            <AddCircleIcon sx={{ fontSize: 32 }} /> 
          </IconButton>
          
          <IconButton 
            sx={{ color: 'black', mr: 2 }}
            onClick={() => navigate('/explore')}
          >
            <ExploreIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton 
            sx={{ color: 'black' }}
            onClick={() => navigate('/cart')}
          >
            <ShoppingCartIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}