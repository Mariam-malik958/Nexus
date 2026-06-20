import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User'; // Mongoose model
import bcrypt from 'bcryptjs';

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Find user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 2. Hash new password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // 3. Update fields
    user.name      = req.body.name      ?? user.name;
    user.email     = req.body.email     ?? user.email;
    user.bio       = req.body.bio       !== undefined ? req.body.bio : user.bio;
    user.avatarUrl = req.body.avatarUrl ?? user.avatarUrl;

    // 4. Save updated user
    await user.save();

    res.json({
      id:        user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      avatarUrl: user.avatarUrl,
      bio:       user.bio,
      isOnline:  user.isOnline,
      createdAt: user.createdAt
    });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/user/:id
// @access  Public or Private
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};