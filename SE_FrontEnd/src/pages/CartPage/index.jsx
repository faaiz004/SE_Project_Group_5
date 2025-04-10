import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack, Add, Remove } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { cartStyles } from './styles';

import deleteIcon from '../../assets/Mannequin/delete_icon.jpeg';
import redHoodie from '../../assets/Mannequin/red_hoodie.jpg';
import blueDenim from '../../assets/Mannequin/blue_denim.jpg';

const CartPage = () => {
  const navigate = useNavigate();
  const styles = cartStyles;

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Black T-Shirt', price: 681, description: 'Cotton vibery', quantity: 1 },
    { id: 2, name: 'Blue Pant', price: 681, description: 'Cotton shoooo', quantity: 1 },
    { id: 3, name: 'Pink Sweater', price: 681, description: 'Josta hooooo', quantity: 1 }
  ]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const renderCartItem = (item) => (
    <Box key={item.id} sx={styles.cartItem}>
      <Box sx={styles.productImageContainer}>
        <Box
          component="img"
          src={redHoodie}
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

        <Box sx={styles.quantityDisplay}>
          <Typography>{item.quantity}</Typography>
        </Box>

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
        <Box
          component="img"
          src={deleteIcon}
          alt="Delete"
          width={20}
          height={20}
        />
      </IconButton>
    </Box>
  );

  const renderCartItems = () => (
    <>
      <Typography variant="h5" sx={styles.title}>Shopping Cart</Typography>
      <Typography sx={styles.subtitle}>
        You have {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
      </Typography>

      {cartItems.map(renderCartItem)}
    </>
  );

  const renderCartSummary = () => (
    <Box sx={styles.summaryContainer}>
      <Box sx={styles.previewImagesContainer}>
        <Box
          component="img"
          src={redHoodie}
          alt="Top product preview"
          sx={styles.topPreviewImage}
        />
        <Box
          component="img"
          src={blueDenim}
          alt="Bottom product preview"
          sx={styles.bottomPreviewImage}
        />
      </Box>

      <Box sx={styles.totalContainer}>
        <Typography variant="h4" sx={styles.totalPrice}>
          PKR {cartTotal.toLocaleString()}
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
  );

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
          {renderCartItems()}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderCartSummary()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
