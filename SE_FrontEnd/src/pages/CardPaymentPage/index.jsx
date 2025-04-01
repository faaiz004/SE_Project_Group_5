import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const CardPaymentPage = () => {
  const navigate = useNavigate();

  // Move handleSubmit inside the component
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/order-confirmation');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Button 
        component={Link} 
        to="/checkout" 
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: '#1976d2' }}
      >
        Back to Checkout
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Card Payment</Typography>

      {/* Connect form to handleSubmit */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Card Holder Name"
          sx={{ mb: 3 }}
          required
        />
        <TextField
          fullWidth
          label="Card Number"
          inputProps={{ pattern: "[0-9]{16}" }}
          sx={{ mb: 3 }}
          required
        />
        
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="CVV"
            inputProps={{ pattern: "[0-9]{3}" }}
            required
          />
          <TextField
            fullWidth
            label="Expiry Date"
            type="month"
            required
          />
        </Box>

        {/* Order Summary */}
        <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Your Items</Typography>
          {[1, 2].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Typography>Black Gown PKR 3,499</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Color: Blue | Size: M | Season: 24:25
              </Typography>
            </Box>
          ))}
          <Typography sx={{ textAlign: 'right', fontWeight: 600 }}>
            PKR 1,672
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'right', color: 'text.secondary' }}>
            Taxes & Shipping Inc.
          </Typography>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          Complete Payment
        </Button>
      </form>
    </Box>
  );
};

export default CardPaymentPage;