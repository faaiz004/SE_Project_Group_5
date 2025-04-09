import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Grid, Divider } from '@mui/material';
import { ArrowBack, Add, Remove } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { cartStyles } from './styles';
import delete_icon from '../../assets/Mannequin/delete_icon.jpeg';
import red_hoodie from '../../assets/Mannequin/red_hoodie.jpg';
import blude_denim from '../../assets/Mannequin/blue_denim.jpg'; 

const CartPage = () => {
  const navigate = useNavigate();
  const styles = cartStyles;
  
  // Temporary data - replace with your API data
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Black T-Shirt', price: 681, description: 'Cotton vibery', quantity: 1 },
    { id: 2, name: 'Blue Pant', price: 681, description: 'Cotton shoooo', quantity: 1 },
    { id: 3, name: 'Pink Sweater', price: 681, description: 'Josta hooooo', quantity: 1 }
  ]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  return (
    <Box sx={styles.container}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<ArrowBack />}
            sx={styles.backButton}
          >
            Continue Shopping
          </Button>
          
          <Divider sx={styles.divider} />

          <Typography variant="h5" sx={styles.title}>Shopping cart</Typography>
          <Typography sx={styles.subtitle}>
            You have {cartItems.length} item in your cart
          </Typography>

          {cartItems.map((item) => (
            <Box key={item.id} sx={styles.cartItem}>
              <Box sx={styles.productImageContainer}>
                <Box 
                  component="img"
                  src= {red_hoodie} // Replace with actual path
                  alt={item.name}
                  sx={styles.productImage}
                />
              </Box>
              
              <Box sx={styles.productInfo}>
                <Typography variant="h6" sx={styles.productName}>{item.name}</Typography>
                <Typography variant="body2" sx={styles.productDescription}>
                  {item.description}
                </Typography>
              </Box>
              
              <Box sx={styles.quantityControls}>
                <IconButton 
                  sx={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Box sx={styles.quantityDisplay}></Box>
                <IconButton 
                  sx={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h6" sx={styles.productPrice}>
                ${item.price}
              </Typography>
              
              <IconButton 
                sx={styles.deleteButton}
                onClick={() => handleRemoveItem(item.id)}
              >
                <Box component="img" src={delete_icon} alt="Delete" width={20} height={20} />
              </IconButton>
            </Box>
          ))}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={styles.summaryContainer}>
            <Box sx={styles.previewImagesContainer}>
              <Box 
                component="img"
                src={red_hoodie} // Replace with actual path
                alt="Top product preview"
                sx={styles.topPreviewImage}
              />
              <Box 
                component="img"
                src={blude_denim} // Replace with actual path
                alt="Bottom product preview"
                sx={styles.bottomPreviewImage}
              />
            </Box>
            
            <Box sx={styles.totalContainer}>
              <Typography variant="h4" sx={styles.totalPrice}>
                PKR {total.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={styles.taxesNote}>
                Taxes & Shipping Inc.
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/checkout')}
                sx={styles.checkoutButton}
                endIcon={<ArrowBack sx={{ transform: 'rotate(180deg)' }} />}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;