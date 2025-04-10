import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material'; 

{/* Importing the ArrowBack icon for the back button */}
const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      navigate('/card-payment');
    } else {
      navigate('/order-confirmation');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Button 
        component={Link} 
        to="/cart" 
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: '#1976d2' }}
      >
        Continue Shopping
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Checkout</Typography>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Personal Information</Typography>
        <TextField
          fullWidth
          label="Full Name"
          sx={{ mb: 3 }}
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          sx={{ mb: 3 }}
          required
        />
        <TextField
          fullWidth
          label="Phone Number"
          sx={{ mb: 4 }}
          required
        />

        {/* Delivery Information */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Delivery</Typography>
        <TextField
          fullWidth
          select
          label="Country"
          SelectProps={{ native: true }}
          sx={{ mb: 3 }}
          required
        >
          <option value=""></option>
          <option value="PK">Pakistan</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="City"
          SelectProps={{ native: true }}
          sx={{ mb: 3 }}
          required
        >
          <option value=""></option>
          <option value="LHR">Lahore</option>
        </TextField>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={3}
          sx={{ mb: 4 }}
          required
        />

        {/* Payment Options */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Payment Options</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{ mb: 4 }}
        >
          <FormControlLabel 
            value="cod" 
            control={<Radio />} 
            label="Cash on Delivery" 
          />
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Debit/Credit Card"
          />
        </RadioGroup>

        {/* Order Summary */}
        <Box sx={{ 
          border: '1px solid #eee', 
          borderRadius: 2, 
          p: 3, 
          mb: 4 
        }}>
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
          Proceed to Payment
        </Button>
      </form>
    </Box>
  );
};

export default CheckoutPage;