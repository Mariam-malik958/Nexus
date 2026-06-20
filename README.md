## **Nexus – Investor & Entrepreneur Collaboration Platform**

A full-stack web platform connecting investors and entrepreneurs through smart collaboration tools including meeting scheduling, video calling, document management, and secure payments.

##  Project Overview ##
Nexus is a collaboration platform designed to bridge the gap between investors and entrepreneurs. This repository contains both the frontend and backend integration of the platform, built as part of a 3-week Full Stack Development Internship.

## Tech Stack ##
Frontend
React.js
Vercel (Deployment)
Backend
Node.js + Express.js
MongoDB / PostgreSQL
Socket.IO (WebRTC Signaling)
Render / Heroku / AWS (Deployment)
Integrations
Auth: JWT + bcrypt + 2FA (Nodemailer)
Video: WebRTC + Socket.IO
Documents: Multer + AWS S3 + React PDF Viewer
Payments: Stripe / PayPal Sandbox
API Docs: Swagger / Postman

## Key Features ##
1. User Authentication: Signup, Login with JWT
2. CRUD Operations for main entities
3. RESTful API design
4. Responsive and clean UI
5. Error handling + validation

## Clone the repository ##
git clone https://github.com/Mariam_malik958/nexus.git
cd nexus

##Backup Setup ##
cd backend
npm install
npm run dev

## Frontend setup ##
cd frontend
npm install
npm start

## Environment Variables ##
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

## License##

This project was developed as part of the Full Stack Development Internship at Developer Hub Corporation.


## Developed by #
Mariam malik 
