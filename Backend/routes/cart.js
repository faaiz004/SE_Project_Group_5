import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
// import User from '../models/User.js'; // You'll need to create this model

const User = {
  findById: async (id) => ({
    cart: [],
    save: async () => {}
  })
};

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.cart.push(req.body.productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;