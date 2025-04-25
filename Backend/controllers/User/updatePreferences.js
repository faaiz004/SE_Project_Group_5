import User from '../../models/User.js';

export const updateUserPreferences = async (req, res) => {
	try {
		const userId = req.user.id;
		const {
			gender,
			shirtSize,
			pantSize,
			weightClass,
			stylePreference,
			preferencesCompleted
		} = req.body;

		// Build update object dynamically to avoid overwriting unintentionally
		const updateFields = {};
		if (gender) updateFields.gender = gender;
		if (shirtSize) updateFields.shirtSize = shirtSize;
		if (pantSize) updateFields.pantSize = pantSize;
		if (weightClass) updateFields.weightClass = weightClass;
		if (stylePreference) updateFields.stylePreference = stylePreference;
		if (preferencesCompleted !== undefined) updateFields.preferencesCompleted = preferencesCompleted;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: updateFields },
			{ new: true, runValidators: true }
		).select('gender shirtSize pantSize weightClass stylePreference preferencesCompleted');

		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found.' });
		}

		return res.status(200).json({ message: 'Preferences updated.', user: updatedUser });
	} catch (err) {
		console.error('Error updating preferences:', err);
		return res.status(500).json({ error: 'Server error.' });
	}
};
