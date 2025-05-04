import User from '../../models/User.js';

export const submitPreferences = async (req, res) => {
  try {
    const userId = req.user.id;  
    const { gender, shirtSize, pantSize, stylePreference } = req.body;

    if (!gender || !shirtSize || !pantSize || !stylePreference) {
      return res.status(400).json({ error: 'Missing preference fields.' });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        gender,
        shirtSize,
        pantSize,
        stylePreference,
        preferencesCompleted: true
      }
    );

    return res.status(200).json({
      message: 'Preferences saved successfully',
      preferencesCompleted: true
    });

  } catch (err) {
    console.error('Preference submission error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
