import { genSalt } from 'bcrypt';
import Clothes from '../../../models/clothes.js';

export const getAllClothes = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const clothesItems = await Clothes.find(filter);

    const clothesResponse = clothesItems.map(item => {
      const clothing = item.toObject();
      return {
        _id: clothing._id,
        name: clothing.name,
        brand: clothing.brand,
        size: clothing.size,
        category: clothing.category,
        price: clothing.price,
        upper: clothing.upper,
        lower: clothing.lower,
        imageUrl: clothing.imageUrl || null,
        gender: clothing.gender,
        
      };
    });

    res.status(200).json(clothesResponse);
  } catch (error) {
    console.error('Error fetching clothes:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
