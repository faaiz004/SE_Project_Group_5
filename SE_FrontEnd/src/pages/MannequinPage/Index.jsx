// MannequinPage.jsx
import React, { useState } from 'react';
import { Box, Grid, Button, Card, CardContent, Typography } from '@mui/material';
import DraggableClothing from '../../Layouts/MannequinPage/DraggableClothing.jsx';
import redHoodie from '../../assets/MannequinPage/red_hoodie.jpg';
import blueHoodie from '../../assets/MannequinPage/red_hoodie.jpg';
import blueDenim from '../../assets/MannequinPage/blue_denim.jpg';
import blackDenim from '../../assets/MannequinPage/blue_denim.jpg';
import mannequin from '../../assets/MannequinPage/Mannequin.png';



// Sample data for tops and bottoms
const topsData = [
    {
      id: 1,
      name: 'Red Hoodie',
      price: 2500,
      color: 'Red',
      sizes: ['S', 'M', 'L', 'XL'],
      image: redHoodie,
    },
    {
      id: 2,
      name: 'Blue Hoodie',
      price: 2700,
      color: 'Blue',
      sizes: ['S', 'M', 'L', 'XL'],
      image: blueHoodie,
    },
  ];
  
  const bottomsData = [
    {
      id: 1,
      name: 'Blue Denim Pants',
      price: 2500,
      color: 'Blue',
      sizes: ['S', 'M', 'L', 'XL'],
      image: blueDenim,
    },
    {
      id: 2,
      name: 'Black Denim Pants',
      price: 3000,
      color: 'Black',
      sizes: ['S', 'M', 'L', 'XL'],
      image: blackDenim,
    },
  ];
  

function MannequinPage() {
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const handleNextTop = () => setTopIndex((prev) => (prev + 1) % topsData.length);
  const handlePrevTop = () => setTopIndex((prev) => (prev - 1 + topsData.length) % topsData.length);
  const handleNextBottom = () => setBottomIndex((prev) => (prev + 1) % bottomsData.length);
  const handlePrevBottom = () => setBottomIndex((prev) => (prev - 1 + bottomsData.length) % bottomsData.length);

  const selectedTop = topsData[topIndex];
  const selectedBottom = bottomsData[bottomIndex];

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Mannequin and Clothing Section */}
        <Grid item xs={12} md={8}>
            <Box
            sx={{
            position: 'relative',
            width: 400,
            height: 600,
            margin: '0 auto',
            backgroundImage: `url(${mannequin})`,
            backgroundSize: 'cover',
            borderRadius: 2,
            boxShadow: 3,
            }}
        >
            {/* Draggable Clothing Overlays */}
            <DraggableClothing src={selectedTop.image} alt={selectedTop.name} style={{ top: '10%' }} />
            <DraggableClothing src={selectedBottom.image} alt={selectedBottom.name} style={{ bottom: '10%' }} />

            {/* Navigation Buttons for Top Clothing */}
            <Button
              onClick={handlePrevTop}
              sx={{
                position: 'absolute',
                top: '40%',
                left: 0,
                minWidth: 'auto',
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              ←
            </Button>
            <Button
              onClick={handleNextTop}
              sx={{
                position: 'absolute',
                top: '40%',
                right: 0,
                minWidth: 'auto',
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              →
            </Button>

            {/* Navigation Buttons for Bottom Clothing */}
            <Button
              onClick={handlePrevBottom}
              sx={{
                position: 'absolute',
                bottom: '40%',
                left: 0,
                minWidth: 'auto',
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              ←
            </Button>
            <Button
              onClick={handleNextBottom}
              sx={{
                position: 'absolute',
                bottom: '40%',
                right: 0,
                minWidth: 'auto',
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              →
            </Button>
          </Box>
        </Grid>

        {/* Product Information Panels */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedTop.name}
              </Typography>
              <Typography variant="body1">Price: PKR {selectedTop.price}</Typography>
              <Typography variant="body2">Color: {selectedTop.color}</Typography>
              <Typography variant="body2">Sizes: {selectedTop.sizes.join(', ')}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                Buy Top
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedBottom.name}
              </Typography>
              <Typography variant="body1">Price: PKR {selectedBottom.price}</Typography>
              <Typography variant="body2">Color: {selectedBottom.color}</Typography>
              <Typography variant="body2">Sizes: {selectedBottom.sizes.join(', ')}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                Buy Bottom
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MannequinPage;
