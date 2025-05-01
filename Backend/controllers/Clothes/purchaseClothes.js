// This file fetches purchased clothes for a user and generates signed URLs for their images.
import User from '../../models/User.js';
import Clothes from '../../models/clothes.js';

export const purchaseClothes = async (req, res) => {
  try {
    const { email, clothesId } = req.body;


    if (!email || !clothesId) {
      console.warn('Missing parameters:', { email, clothesId });
      return res.status(400).json({ error: 'Both email and clothesId must be provided.' });
    }

    // Check clothes existence
    const clothesItem = await Clothes.findById(clothesId);
    if (!clothesItem) {
      console.warn(`Clothes item not found for ID: ${clothesId}`);
      return res.status(404).json({ error: `No clothes item found with ID: ${clothesId}` });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`User not found for email: ${email}`);
      return res.status(404).json({ error: `No user found with email: ${email}` });
    }


    user.ownedProducts.push(clothesId);

    try {
      await user.save();
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        console.error('Mongoose Validation Error:', validationError.errors);
        const messages = Object.values(validationError.errors).map(err => err.message);
        return res.status(400).json({ error: 'Validation failed.', details: messages });
      }
      console.error('Error during user.save():', validationError);
      throw validationError;
    }

    return res.status(200).json({
      message: `Successfully purchased: ${clothesItem.name}`,
      ownedProducts: user.ownedProducts
    });

  } catch (error) {
    console.error('Unexpected error in purchaseClothes:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
};
