import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

export const loginUser = async (req, res, next) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and phone number.',
      });
    }

    const cleanUsername = username.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (cleanUsername.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 2 characters long.',
      });
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be a valid 10-digit mobile number.',
      });
    }

    if (getDBStatus()) {
      let user = await User.findOne({ phone: cleanPhone });

      if (user) {
        user.username = cleanUsername;
        user.lastLogin = new Date();
        await user.save();
      } else {
        user = await User.create({
          username: cleanUsername,
          phone: cleanPhone,
          lastLogin: new Date(),
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          phone: user.phone,
          lastLogin: user.lastLogin,
        },
      });
    }

    // Fallback in-memory mode if DB is disconnected
    return res.status(200).json({
      success: true,
      message: 'Login successful (Demo Mode)',
      user: {
        id: `u_${Date.now()}`,
        username: cleanUsername,
        phone: cleanPhone,
        lastLogin: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
