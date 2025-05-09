import User from '../../models/User.js';
import Clothes from '../../models/clothes.js';

export const saveClothes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { clothesId } = req.params;

    
    const clothesExists = await Clothes.findById(clothesId);
    if (!clothesExists) {
      return res.status(404).json({ error: 'Clothes item not found.' });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedClothes: clothesId } }, 
      { new: true }
    );

    return res.json({ success: true, message: 'Clothes saved successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error while saving clothes.' });
  }
};


export const unsaveClothes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { clothesId } = req.params;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedClothes: clothesId } },
      { new: true }
    );

    return res.json({ success: true, message: 'Clothes unsaved successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error while unsaving clothes.' });
  }
};

export const getSavedClothes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedClothes');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ clothes: user.savedClothes });

  } catch (err) {
    return res.status(500).json({ error: 'Server error while fetching saved clothes.' });
  }
};
