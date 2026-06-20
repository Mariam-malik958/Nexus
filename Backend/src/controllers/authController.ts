import { Request, Response } from 'express';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Prisma: prisma.user.findUnique -> Mongoose: User.findOne
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    // Prisma: prisma.user.create -> Mongoose: User.create
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'entrepreneur',
      avatarUrl
    });

    res.status(201).json({
      user: {
        id: user._id.toString(), // Mongoose mein default ID `_id` hoti hai
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isOnline: user.isOnline,
        createdAt: user.createdAt
      },
      token: generateToken(user._id.toString()), 
    });
  } catch (error) {
    console.error("❌ Register Error:", error); 
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Prisma: prisma.user.findUnique -> Mongoose: User.findOne
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
          id: user._id.toString(), 
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          isOnline: user.isOnline,
          createdAt: user.createdAt
        },
        token: generateToken(user._id.toString()), 
      });
      return;
    } 
    
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error("❌ Login Error:", error); 
    res.status(500).json({ message: (error as Error).message });
  }
};