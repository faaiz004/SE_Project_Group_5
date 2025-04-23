import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { purchaseClothes } from '../../services/PurchaseClothes/Index';

const CardPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      setError(err.response?.data?.error || err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Button
        component={Link}
        to="/checkout"
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: '#1976d2' }}
        disabled={loading}
      >
        Back to Checkout
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Card Payment
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Card Holder Name"
          sx={{ mb: 3 }}
          required
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Card Number"
          inputProps={{ pattern: "[0-9]{16}" }}
          sx={{ mb: 3 }}
          required
          disabled={loading}
        />

        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="CVV"
            inputProps={{ pattern: "[0-9]{3}" }}
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Expiry Date"
            type="month"
            required
            disabled={loading}
          />
        </Box>

        {/* Order Summary */}
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
            : 'Complete Payment'}
        </Button>
      </form>
    </Box>
  );
};

export default CardPaymentPage;
