import User from '../../models/User.js';
import Clothes from '../../models/clothes.js';

export const purchaseClothes = async (req, res) => {
  try {
    const { email, clothesId } = req.body;


    if (!email || !clothesId) {
      return res.status(400).json({ error: 'Both email and clothesId must be provided.' });
    }

    const clothesItem = await Clothes.findById(clothesId);
    if (!clothesItem) {
      return res.status(404).json({ error: `No clothes item found with ID: ${clothesId}` });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `No user found with email: ${email}` });
    }


    user.ownedProducts.push(clothesId);

    try {
      await user.save();
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        const messages = Object.values(validationError.errors).map(err => err.message);
        return res.status(400).json({ error: 'Validation failed.', details: messages });
      }
      throw validationError;
    }

    return res.status(200).json({
      message: `Successfully purchased: ${clothesItem.name}`,
      ownedProducts: user.ownedProducts
    });

  } catch (error) {
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
};
