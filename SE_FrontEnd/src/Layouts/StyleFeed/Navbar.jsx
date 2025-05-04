import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Typography from '@mui/material/Typography';

export default function Navbar() {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(sessionStorage.getItem('cart')) || []
  );

  useEffect(() => {
    const updateCartFromStorage = () => {
      try {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
      }
    };

    const intervalId = setInterval(updateCartFromStorage, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: '#f0f0f0',
          padding: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', transition: 'transform .2s', '&:hover': { transform: 'scale(1.03)' }, color: '#000000' }}
            onClick={() => navigate('/explore')}
          >
            Swipe-Fit
          </Typography>

          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
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

            <IconButton
              sx={{ color: 'black', mr: 2 }}
              onClick={() => navigate('/stylefeed')}
            >
              <GroupAddIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <Box sx={{ position: 'relative', mr: 2 }}>
              <IconButton
                sx={{ color: 'black' }}
                onClick={() => navigate('/cart')}
              >
                <ShoppingCartIcon sx={{ fontSize: 28 }} />
              </IconButton>
              {cartItems.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: '#FF5733',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}
                >
                  {cartItems.length}
                </Box>
              )}
            </Box>

            <IconButton
              sx={{ color: 'black' }}
              onClick={() => navigate('/account')}
            >
              <PersonIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
