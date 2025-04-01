import React from 'react';
import { Box, Typography, Button, Divider, IconButton } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  
  // Temporary data - replace with your API data
  const cartItems = [
    { id: 1, name: 'Block T-Shirt', price: 681, description: 'Cotton vibery' },
    { id: 2, name: 'Blue Pant', price: 681, description: 'Cotton shoooo' },
    { id: 3, name: 'Pink Sweater', price: 681, description: 'Josta hooooo' }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Button 
        component={Link} 
        to="/" 
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: '#1976d2' }}
      >
        Continue Shopping
      </Button>

      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Shopping cart</Typography>
      <Typography sx={{ mb: 4, color: 'text.secondary' }}>
        You have {cartItems.length} items in your cart
      </Typography>

      {cartItems.map((item) => (
        <Box key={item.id} sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Box>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">PKR {item.price}</Typography>
              <IconButton sx={{ color: 'error.main' }}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
          <Divider />
        </Box>
      ))}

      <Box sx={{ mt: 4, borderTop: '2px solid #eee', pt: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
          PKR {total}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Taxes & Shipping Inc.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate('/checkout')}
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;