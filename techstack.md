# 📄 tech-stack.md  
## Technical Architecture & System Design  
**Project:** Cricket Connect (MVP)

---

## 1️⃣ Overview

Cricket Connect is a **mobile-first MERN stack application** designed to streamline cricket match organization with real-time booking, geolocation-based discovery, OTP authentication, and high-performance UI animations using GSAP.

Architecture follows a **SPA + REST API + Cloud Services** model optimized for scalability and performance.

---

## 2️⃣ Core Technology Stack

| Layer | Technology | Purpose |
|-------|------------|----------|
| **Frontend** | React.js (Vite) | Fast, mobile-first SPA |
| **Styling** | Tailwind CSS | Utility-first responsive UI |
| **Animations** | GSAP | High-performance transitions & micro-interactions |
| **State Management** | Redux Toolkit | Role toggle, booking & match state |
| **Backend** | Node.js + Express.js | REST API & business logic |
| **Database** | MongoDB (Mongoose) | Flexible schema & geospatial queries |
| **Authentication** | Firebase Auth (OTP) | Phone-based login |
| **Storage** | Cloudinary | Player avatars & ground photos |
| **Maps & Location** | Google Maps API | Map pin & geolocation integration |
| **Payments** | Razorpay / Stripe (TBD) | Advance booking payments |
| **Frontend Hosting** | Vercel / Netlify | SPA deployment |
| **Backend Hosting** | Render / Railway / AWS | API deployment |
| **Database Hosting** | MongoDB Atlas | Managed cloud database |

---

## 3️⃣ Frontend Architecture

### Folder Structure
src/
├── app/
├── features/
│ ├── auth/
│ ├── matches/
│ ├── grounds/
│ └── bookings/
├── components/
├── pages/
├── animations/
├── hooks/
├── services/
└── utils/


### Key Decisions

- Mobile-first responsive layout
- Bottom tab navigation
- Floating Action Button (FAB)
- GSAP-powered:
  - Page slide transitions
  - Staggered card animations
  - Booking success animation
- Redux slices:
  - authSlice
  - matchSlice
  - groundSlice
  - bookingSlice

---

## 4️⃣ Backend Architecture

### Pattern

- RESTful API (MVC structure)
- Firebase Admin SDK for token verification
- Middleware-driven validation
- Centralized error handling

### Folder Structure
server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
└── config/


---

## 5️⃣ Database Design (MongoDB)

### 5.1 User Collection

```json
{
  "_id": "ObjectId",
  "phone": "String",
  "name": "String",
  "role": "String",
  "disciplineRating": "Number",
  "isOwner": "Boolean",
  "location": {
    "type": "Point",
    "coordinates": [lng, lat]
  },
  "createdAt": "Date"
}
5.2 Ground Collection
{
  "_id": "ObjectId",
  "ownerId": "ObjectId",
  "name": "String",
  "images": ["String"],
  "amenities": ["Lights", "Water", "Parking"],
  "pricePerHour": "Number",
  "slots": [
    {
      "startTime": "ISODate",
      "endTime": "ISODate",
      "status": "Available | Booked | Blocked"
    }
  ],
  "location": {
    "type": "Point",
    "coordinates": [lng, lat]
  }
}

5.3 Match Collection
{
  "_id": "ObjectId",
  "creatorId": "ObjectId",
  "teamName": "String",
  "matchType": "Tennis | Leather | Box",
  "playersNeeded": "Number",
  "status": "Open | Confirmed | Completed | Cancelled",
  "groundId": "ObjectId",
  "whatsappLink": "String",
  "startTime": "ISODate"
}
5.4 Booking Collection
{
  "_id": "ObjectId",
  "groundId": "ObjectId",
  "userId": "ObjectId",
  "slotStart": "ISODate",
  "slotEnd": "ISODate",
  "paymentStatus": "Pending | Paid | Failed",
  "transactionId": "String"
}
6️⃣ Core API Endpoints
Authentication
POST   /api/auth/otp-send
POST   /api/auth/verify
Matches
POST   /api/matches/create
GET    /api/matches/nearby
PUT    /api/matches/:id/confirm
POST   /api/matches/:id/rate
Grounds
POST   /api/grounds/create
GET    /api/grounds/nearby
PUT    /api/grounds/:id/update
Booking
POST   /api/bookings/create
POST   /api/bookings/verify-payment
7️⃣ System Architecture Flow
Client (React + GSAP)
        ↓
Redux State Layer
        ↓
Express REST API
        ↓
MongoDB Atlas
        ↓
Cloudinary / Firebase / Payment Gateway
8️⃣ Geospatial Strategy

MongoDB 2dsphere index on user & ground location

$near queries for:

Nearby matches

Nearby grounds

GPS via browser/mobile device

9️⃣ Security Strategy

Firebase OTP Authentication

Firebase Admin token verification middleware

Role-based access control

Input validation (Joi / Zod)

Rate limiting on OTP endpoints

Helmet.js security headers

🔟 Performance Optimization

Vite fast builds

Code splitting & lazy loading

GSAP hardware-accelerated animations

Indexed geospatial queries

CDN image delivery (Cloudinary)

Redis (future scope) for caching