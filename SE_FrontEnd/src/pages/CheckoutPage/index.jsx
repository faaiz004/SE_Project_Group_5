import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { purchaseClothes } from '../../api/clothesService';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'card') {
      navigate('/card-payment');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        cartItems.map(item => purchaseClothes(item.productId))
      );
      sessionStorage.removeItem('cart');
      navigate('/order-confirmation');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Button
        component={Link}
        to="/cart"
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: '#1976d2' }}
        disabled={loading}
      >
        Continue Shopping
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Checkout
      </Typography>

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Personal Information
        </Typography>
        <TextField fullWidth label="Full Name" sx={{ mb: 3 }} required disabled={loading} />
        <TextField fullWidth label="Email" type="email" sx={{ mb: 3 }} required disabled={loading} />
        <TextField fullWidth label="Phone Number" sx={{ mb: 4 }} required disabled={loading} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Delivery
        </Typography>
        <TextField
          fullWidth
          select
          label="Country"
          SelectProps={{ native: true }}
          sx={{ mb: 3 }}
          required
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Payment Options
        </Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{ mb: 4 }}
        >
          <FormControlLabel
            value="cod"
            control={<Radio disabled={loading} />}
            label="Cash on Delivery"
          />
          <FormControlLabel
            value="card"
            control={<Radio disabled={loading} />}
            label="Debit/Credit Card"
          />
        </RadioGroup>

        <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Items
          </Typography>
          {cartItems.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography>
                {item.name}{item.price ? ` — PKR ${item.price}` : ''}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Brand: {item.brand} | Size: {item.size}
              </Typography>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography sx={{ fontWeight: 600 }}>Total</Typography>
            <Typography sx={{ fontWeight: 600 }}>PKR {total}</Typography>
          </Box>
          <Typography variant="body2" sx={{ textAlign: 'right', color: 'text.secondary' }}>
            Taxes & Shipping Inc.
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ py: 2, fontSize: '1.1rem' }}
          disabled={loading}
        >
          {loading
            ? <CircularProgress size={24} color="inherit" />
            : 'Proceed to Payment'}
        </Button>
      </form>
    </Box>
  );
};

export default CheckoutPage;
