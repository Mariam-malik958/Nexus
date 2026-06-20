import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected for seeding');

    // Clear existing users to prevent duplicates during seed
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Demo Entrepreneur
    await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@techwave.io',
      password: hashedPassword,
      role: 'entrepreneur',
      avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      bio: 'Serial entrepreneur with 10+ years of experience in SaaS and fintech.',
      isOnline: true
    });

    // Create Demo Investor
    await User.create({
      name: 'Michael Rodriguez',
      email: 'michael@vcinnovate.com',
      password: hashedPassword,
      role: 'investor',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'Early-stage investor with focus on B2B SaaS and fintech.',
      isOnline: true
    });

    console.log('Demo users seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

seedUsers();
