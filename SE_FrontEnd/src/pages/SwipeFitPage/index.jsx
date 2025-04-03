// src/pages/SwipeFitPage/Index.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Card, CardContent, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { PageContainer, MannequinWrapper, ProductCard, MannequinImage, ProductDetails } from './Styles';

// --- Sample images (replace with your own) ---
import mannequinBase from '../../assets/Mannequin/base.png'; // The blank mannequin
import redHoodie from '../../assets/Mannequin/red_hoodie.jpg'; // Hoodie overlay
import blueDenim from '../../assets/Mannequin/blue_denim.jpg'; // Pants overlay

const tops = [
  {
    id: 1,
    name: 'Red Hoodie',
    price: 'PKR 2,500',
    color: 'Black',
    size: 'S, M, L, XL, XXL',
    season: '23-24',
    image: redHoodie,
  },
  // Add more tops here...
];

const bottoms = [
  {
    id: 1,
    name: 'Blue Denim Pants',
    price: 'PKR 2,500',
    color: 'Black',
    size: 'S, M, L, XL, XXL',
    season: '23-24',
    image: blueDenim,
  },
  // Add more bottoms here...
];

const SwipeFitPage = () => {
  // Indices to track which top and bottom we’re showing
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  // Get current items
  const currentTop = tops[topIndex];
  const currentBottom = bottoms[bottomIndex];

  // Handlers to cycle through tops/bottoms
  const handleNextTop = () => {
    setTopIndex((prev) => (prev + 1) % tops.length);
  };

  const handlePrevTop = () => {
    setTopIndex((prev) => (prev - 1 + tops.length) % tops.length);
  };

  const handleNextBottom = () => {
    setBottomIndex((prev) => (prev + 1) % bottoms.length);
  };

  const handlePrevBottom = () => {
    setBottomIndex((prev) => (prev - 1 + bottoms.length) % bottoms.length);
  };

  return (
    <PageContainer>
      {/* Left Section: Mannequin with swipe arrows */}
      <MannequinWrapper>
        <Typography variant="h4" sx={{ mb: 2, color: '#27374D' }}>Swipe-Fit</Typography>

        {/* The mannequin and clothing images */}
        <Box sx={{ position: 'relative' }}>
          {/* Base mannequin */}
          <MannequinImage src={mannequinBase} alt="Mannequin Base" />
          {/* Current top overlay */}
          <MannequinImage src={currentTop.image} alt="Top" />
          {/* Current bottom overlay */}
          <MannequinImage src={currentBottom.image} alt="Bottom" />
        </Box>

        {/* Arrows for tops */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <IconButton onClick={handlePrevTop}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 1 }}>Tops</Typography>
          <IconButton onClick={handleNextTop}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Arrows for bottoms */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton onClick={handlePrevBottom}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 1 }}>Bottoms</Typography>
          <IconButton onClick={handleNextBottom}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </MannequinWrapper>

      {/* Right Section: Product cards (top & bottom) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ProductCard>
          <CardContent>
            <ProductDetails variant="h6">{currentTop.name}</ProductDetails>
            <ProductDetails>{currentTop.price}</ProductDetails>
            <ProductDetails>Color: {currentTop.color}</ProductDetails>
            <ProductDetails>Size: {currentTop.size}</ProductDetails>
            <ProductDetails>Season: {currentTop.season}</ProductDetails>
            <Button variant="contained" sx={{ mt: 2 }}>Buy Now</Button>
          </CardContent>
        </ProductCard>

        <ProductCard>
          <CardContent>
            <ProductDetails variant="h6">{currentBottom.name}</ProductDetails>
            <ProductDetails>{currentBottom.price}</ProductDetails>
            <ProductDetails>Color: {currentBottom.color}</ProductDetails>
            <ProductDetails>Size: {currentBottom.size}</ProductDetails>
            <ProductDetails>Season: {currentBottom.season}</ProductDetails>
            <Button variant="contained" sx={{ mt: 2 }}>Buy Now</Button>
          </CardContent>
        </ProductCard>
      </Box>
    </PageContainer>
  );
};

export default SwipeFitPage;
