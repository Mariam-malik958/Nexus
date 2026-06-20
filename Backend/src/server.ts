import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import meetingRoutes from './routes/meetingRoutes';
import documentRoutes from './routes/documentRoutes';
import paymentRoutes from './routes/paymentRoutes';
import otpRoutes from './otp/otpRoutes'; // ✅ OTP Routes

import { applySecurityMiddleware } from './middleware/securityMiddleware'; // ✅ Security

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP Server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Security Middleware ──────────────────────────────────────────────────────
// ✅ Helmet + XSS + MongoSanitize
applySecurityMiddleware(app);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);   // ✅ Payment APIs
app.use('/api/otp', otpRoutes);            // ✅ OTP / 2FA APIs

// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Nexus Backend API is running with Mongoose and MongoDB Compass.');
});

// ─── Socket.IO Signaling Server ───────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User kisi room mein join karta hai
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    socket.to(roomId).emit('user-connected', userId);

    // User disconnect hone pe
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  // WebRTC Signaling Events
  socket.on('offer', (data: { room: string; offer: any }) => {
    socket.to(data.room).emit('offer', data);
  });

  socket.on('answer', (data: { room: string; answer: any }) => {
    socket.to(data.room).emit('answer', data);
  });

  socket.on('ice-candidate', (data: { room: string; candidate: any }) => {
    socket.to(data.room).emit('ice-candidate', data);
  });
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
async function connectDB() {
  try {
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_db';

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Compass (Mongoose) sa successfully connect ho gaya hai!');
  } catch (error) {
    console.error('❌ Database connection mein error hai:', error);
    process.exit(1);
  }
}

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  await connectDB();
});