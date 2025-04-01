import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/explore');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      p: 4
    }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
      <Typography variant="h3" sx={{ mb: 2 }}>
        Order Confirmed! 🎉
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Thank you for your purchase! Redirecting to explore page...
      </Typography>
      <Button 
        variant="contained"
        component={Link}
        to="/explore"
        size="large"
      >
        Return Now
      </Button>
    </Box>
  );
};

export default OrderConfirmation;