// src/pages/SwipeFitPage/Styles.jsx
import { styled } from '@mui/material/styles';
import { Box, Card, Typography } from '@mui/material';

// Outer container for the page
export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: theme.spacing(4),
  backgroundColor: '#f0f0f0',
  minHeight: '100vh',
}));

// Left section wrapper for the mannequin & controls
export const MannequinWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

// Mannequin & clothing images stacked
export const MannequinImage = styled('img')({
  width: '250px',
  position: 'absolute',
  top: 0,
  left: 0,
  // Adjust for your actual mannequin sizing
});

// Card for product info
export const ProductCard = styled(Card)(({ theme }) => ({
  width: '300px',
  backgroundColor: '#fff',
  borderRadius: '8px',
}));

// Typography for product details
export const ProductDetails = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: '#27374D',
}));
