import User from "../../models/User.js";

export const getUserPreferences = async (req, res) => {
	try {
		const userId = req.user.id; 
		const user = await User.findById(userId).select('gender shirtSize pantSize weightClass stylePreference preferencesCompleted');

		if (!user) {
			return res.status(404).json({ error: 'User not found.' });
		}

		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json({ error: 'Server error.' });
	}
};
