# Affiliate Link Manager (ALM) 🚀

A robust URL shortener and tracking system designed for affiliate marketers to manage, monitor, and optimize their promotion links in real-time.

## ✨ Key Features
- **URL Shortening**: Convert long, messy affiliate links into clean, brandable short URLs.
- **Real-time Analytics**: Track click counts instantly using Socket.io without refreshing the page.
- **Campaign Management**: Organize links into specific campaigns for better performance tracking.
- **Soft Delete (Trash System)**: Safety feature to recover accidentally deleted links.
- **Security**: Protected routes with JWT authentication and secure MongoDB connection.
- **Responsive UI**: Fully optimized for Desktop and Mobile (PWA-ready).

## 🛠 Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion (Animations), Lucide React (Icons).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB Atlas (Mongoose ODM).
- **Real-time**: Socket.io.
- **Deployment**: Vercel (Frontend), Render (Backend).

## 🚀 Installation & Setup
1. Clone the repository: `git clone https://github.com/ThinhPro92/affiliate-link-manager/`
2. Install dependencies: `npm install`
3. Set up `.env` variables (DB_URI, JWT_SECRET, PORT).
4. Start development server: `npm run dev`

