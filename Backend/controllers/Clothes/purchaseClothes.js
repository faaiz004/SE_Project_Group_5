import User from '../../models/User.js';
import Clothes from '../../models/clothes.js';

// Controller to handle purchasing clothes
export const purchaseClothes = async (req, res) => {
  try {
    const { email, clothesId } = req.body;

    if (!email || !clothesId) {
      return res.status(400).json({ error: 'Email and clothesId are required.' });
    }

    // Check if the clothes item exists
    const clothesItem = await Clothes.findById(clothesId);
    if (!clothesItem) {
      return res.status(404).json({ error: 'Clothes item not found.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Directly add clothes item to ownedProducts (no duplicate check)
    user.ownedProducts.push(clothesId);
    await user.save();

    return res.status(200).json({ message: 'Clothes item successfully purchased.', ownedProducts: user.ownedProducts });
  } catch (error) {
    console.error('Error purchasing clothes:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};
