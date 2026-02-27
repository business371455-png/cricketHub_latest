# 🏏 Cricket Connect — Master Implementation Plan (MVP)

---

## Overview

This plan breaks the Cricket Connect MVP into **three major tracks**: Backend, Frontend, and Integration. Each track is further broken into **sequential phases** with clear deliverables. Tasks are ordered by dependency — earlier tasks are prerequisites for later ones.

> [!IMPORTANT]
> This plan assumes a fresh project setup. All work happens inside `c:\Users\Karan\OneDrive\Desktop\CricketHUb`.

---

# Phase 0 — Project Scaffolding

- [ ] **0.1** Initialize monorepo structure with `client/` and `server/` folders
- [ ] **0.2** Initialize backend: `npm init` inside `server/`, install core dependencies (express, mongoose, cors, dotenv, helmet, morgan, express-rate-limit, joi)
- [ ] **0.3** Initialize frontend: `npx create-vite@latest ./` inside `client/` with React + JS template
- [ ] **0.4** Install frontend dependencies (react-router-dom, @reduxjs/toolkit, react-redux, gsap, tailwindcss, axios)
- [ ] **0.5** Configure Tailwind CSS with design tokens from `design.md` (colors, fonts, breakpoints)
- [ ] **0.6** Create `.env.example` files for both client and server with placeholder keys
- [ ] **0.7** Setup `nodemon` for backend dev server, confirm `vite dev` works for frontend

---

# 🔧 Track A — Backend (Node.js / Express)

---

## Phase 1 — Server Foundation

- [ ] **A1.1** Create Express app entry point (`server/index.js`) with middleware stack (cors, helmet, morgan, json parser, rate limiter)
- [ ] **A1.2** Create config module (`server/config/db.js`) for MongoDB Atlas connection via Mongoose
- [ ] **A1.3** Create centralized error handler middleware (`server/middleware/errorHandler.js`)
- [ ] **A1.4** Create async handler utility (`server/utils/asyncHandler.js`) for wrapping async route handlers
- [ ] **A1.5** Setup environment-based config (`server/config/env.js`) loading from `.env`
- [ ] **A1.6** Verify server boots, connects to MongoDB, and returns health check at `GET /api/health`

---

## Phase 2 — Database Models (Mongoose)

- [ ] **A2.1** **User Model** (`server/models/User.js`)
  - Fields: phone, name, role (Batsman/Bowler/All-rounder/Wicketkeeper), profileImage, disciplineRating (default 5.0), isOwner, location (GeoJSON Point), createdAt
  - 2dsphere index on `location`

- [ ] **A2.2** **Ground Model** (`server/models/Ground.js`)
  - Fields: ownerId (ref User), name, images[], amenities[], pricePerHour, slots[] (startTime, endTime, status), location (GeoJSON Point), ratings, createdAt
  - 2dsphere index on `location`

- [ ] **A2.3** **Match Model** (`server/models/Match.js`)
  - Fields: creatorId (ref User), teamName, matchType (Tennis/Leather/Box), playersNeeded, players[] (ref User), status (Open/Confirmed/Completed/Cancelled), groundId (ref Ground), whatsappLink, startTime, createdAt

- [ ] **A2.4** **Booking Model** (`server/models/Booking.js`)
  - Fields: groundId (ref Ground), userId (ref User), slotStart, slotEnd, paymentStatus (Pending/Paid/Failed), transactionId, amount, createdAt

- [ ] **A2.5** **Rating Model** (`server/models/Rating.js`)
  - Fields: fromUser, toUser (optional), toGround (optional), matchId, score (1-5), comment, createdAt

---

## Phase 3 — Authentication API

- [ ] **A3.1** Setup Firebase Admin SDK (`server/config/firebase.js`) for OTP token verification
- [ ] **A3.2** Create auth middleware (`server/middleware/auth.js`) to verify Firebase ID token from `Authorization` header
- [ ] **A3.3** Create auth controller (`server/controllers/authController.js`):
  - `POST /api/auth/verify` — Verify Firebase token, create/find user, return JWT or user object
- [ ] **A3.4** Create auth routes (`server/routes/authRoutes.js`)
- [ ] **A3.5** Test auth flow with Postman/Thunder Client

---

## Phase 4 — User API

- [ ] **A4.1** Create user controller (`server/controllers/userController.js`):
  - `GET /api/users/me` — Get current user profile
  - `PUT /api/users/me` — Update profile (name, role, location, profileImage)
  - `PUT /api/users/me/toggle-role` — Toggle isOwner flag
- [ ] **A4.2** Create user routes (`server/routes/userRoutes.js`) — all protected
- [ ] **A4.3** Add Joi/Zod validation schemas for user update

---

## Phase 5 — Ground API

- [ ] **A5.1** Create ground controller (`server/controllers/groundController.js`):
  - `POST /api/grounds` — Create ground (owner only)
  - `GET /api/grounds/nearby?lng=&lat=&radius=` — Geospatial nearby query
  - `GET /api/grounds/:id` — Get single ground details
  - `PUT /api/grounds/:id` — Update ground (owner only)
  - `PUT /api/grounds/:id/slots` — Update slot availability (block/unblock)
- [ ] **A5.2** Create owner-check middleware (`server/middleware/ownerOnly.js`)
- [ ] **A5.3** Create ground routes (`server/routes/groundRoutes.js`)
- [ ] **A5.4** Add Joi validation for ground creation and slot updates
- [ ] **A5.5** Test geospatial queries with sample data

---

## Phase 6 — Match API

- [ ] **A6.1** Create match controller (`server/controllers/matchController.js`):
  - `POST /api/matches` — Create match (auto-generates listing)
  - `GET /api/matches/nearby?lng=&lat=&type=&date=` — Discover nearby matches
  - `GET /api/matches/:id` — Get match details
  - `PUT /api/matches/:id/join` — Join a match
  - `PUT /api/matches/:id/confirm` — Confirm attendance (24h prior)
  - `PUT /api/matches/:id/cancel` — Cancel match
- [ ] **A6.2** Create match routes (`server/routes/matchRoutes.js`)
- [ ] **A6.3** Add validation schemas for match creation

---

## Phase 7 — Booking API

- [ ] **A7.1** Create booking controller (`server/controllers/bookingController.js`):
  - `POST /api/bookings` — Create booking (lock slot, initiate payment)
  - `POST /api/bookings/verify-payment` — Verify payment callback, update slot status
  - `GET /api/bookings/my` — Get current user's bookings
  - `GET /api/bookings/ground/:groundId` — Get bookings for a ground (owner only)
- [ ] **A7.2** Implement slot-locking logic (prevent double-booking at DB level using atomic update)
- [ ] **A7.3** Create booking routes (`server/routes/bookingRoutes.js`)

---

## Phase 8 — Ratings API

- [ ] **A8.1** Create rating controller (`server/controllers/ratingController.js`):
  - `POST /api/ratings` — Submit rating (player→player or player→ground)
  - `GET /api/ratings/ground/:groundId` — Get ratings for a ground
- [ ] **A8.2** Implement discipline rating recalculation on new rating
- [ ] **A8.3** Create rating routes (`server/routes/ratingRoutes.js`)

---

## Phase 9 — Owner Earnings API

- [ ] **A9.1** Create earnings controller (`server/controllers/earningsController.js`):
  - `GET /api/earnings/summary` — Return daily, weekly, monthly revenue and total bookings for owner
- [ ] **A9.2** Create earnings routes (`server/routes/earningsRoutes.js`)

---

## Phase 10 — Backend Utilities & Polish

- [ ] **A10.1** Mount all routers in main `index.js`
- [ ] **A10.2** Add Cloudinary upload utility (`server/utils/cloudinary.js`) + multer config
- [ ] **A10.3** Add image upload endpoint `POST /api/upload`
- [ ] **A10.4** Final sanity test: all endpoints respond correctly

---

# 🎨 Track B — Frontend (React + Vite)

---

## Phase 11 — App Shell & Design System

- [ ] **B11.1** Configure Tailwind config with Cricket Connect design tokens:
  - Colors: Primary Green (#28A745), Deep Navy (#1A237E), Surface Dark (#0F172A), Warning Red (#DC3545), Accent Lime (#4ADE80)
  - Font: Inter (Google Fonts)
  - Breakpoints: mobile (0-639), tablet (640-1023), laptop (1024-1279), desktop (1280+)
- [ ] **B11.2** Create global CSS base styles (`client/src/index.css`) — dark mode default
- [ ] **B11.3** Setup React Router with route structure:
  - `/` → Landing / Login
  - `/home` → Dashboard (Player)
  - `/owner` → Dashboard (Owner)
  - `/profile` → Profile
  - `/matches/:id` → Match Details
  - `/grounds/:id` → Ground Details
  - `/bookings` → My Bookings
- [ ] **B11.4** Create layout components:
  - `BottomTabNav` (mobile)
  - `Sidebar` (desktop)
  - `FAB` (Floating Action Button)
  - `AppLayout` (wraps pages with nav)

---

## Phase 12 — Redux Store

- [ ] **B12.1** Configure Redux store (`client/src/app/store.js`)
- [ ] **B12.2** Create `authSlice` — user data, token, role, loading states
- [ ] **B12.3** Create `matchSlice` — matches list, filters, current match
- [ ] **B12.4** Create `groundSlice` — grounds list, current ground, slots
- [ ] **B12.5** Create `bookingSlice` — bookings list, booking flow state

---

## Phase 13 — API Service Layer

- [ ] **B13.1** Create Axios instance (`client/src/services/api.js`) with base URL and token interceptor
- [ ] **B13.2** Create `authService.js` — OTP verify, get profile
- [ ] **B13.3** Create `matchService.js` — CRUD + nearby discovery
- [ ] **B13.4** Create `groundService.js` — CRUD + nearby + slot management
- [ ] **B13.5** Create `bookingService.js` — create, verify, list
- [ ] **B13.6** Create `ratingService.js` — submit, list
- [ ] **B13.7** Create `uploadService.js` — image upload to backend

---

## Phase 14 — Authentication Pages

- [ ] **B14.1** Create `LoginPage` — phone input + OTP input, Firebase phone auth integration
- [ ] **B14.2** Create `ProfileSetupPage` — name, role (chips), profile image upload, location permission
- [ ] **B14.3** Add GSAP particle background on login screen
- [ ] **B14.4** Wire up authSlice + authService

---

## Phase 15 — Player Dashboard

- [ ] **B15.1** Create `PlayerHome` — match discovery feed with filters (match type, date, distance)
- [ ] **B15.2** Create `MatchCard` component — team name, type, players needed, distance, time
- [ ] **B15.3** Add GSAP staggered card entry animation
- [ ] **B15.4** Create `MatchDetailPage` — full match info, join button, WhatsApp link, player list
- [ ] **B15.5** Create `CreateMatchModal` — 3-step flow (team name → match type → players/overs)
- [ ] **B15.6** FAB triggers CreateMatchModal
- [ ] **B15.7** Empty state with animated cricket ball illustration

---

## Phase 16 — Ground Discovery & Booking

- [ ] **B16.1** Create `GroundSearchPage` — nearby grounds list + map view (Google Maps)
- [ ] **B16.2** Create `GroundCard` component — image, name, amenities tags, price, distance
- [ ] **B16.3** Create `GroundDetailPage` — image carousel, amenities, map pin, slot grid, book button
- [ ] **B16.4** Create `SlotGrid` component — date picker + hourly grid (color-coded: green/yellow/red)
- [ ] **B16.5** Create `BookingFlow` — select date → select slot → confirm → payment → success animation
- [ ] **B16.6** Add GSAP confetti/success animation on booking confirmation

---

## Phase 17 — Owner Dashboard

- [ ] **B17.1** Create `OwnerHome` — ground management overview, earnings summary cards
- [ ] **B17.2** Create `GroundListingForm` — name, images (multi-upload), amenities (tags), price, location (map pin)
- [ ] **B17.3** Create `SlotManager` component — calendar view, tap to block/unblock slots
- [ ] **B17.4** Create `EarningsDashboard` — daily/weekly/monthly revenue chart (simple bar/line chart)
- [ ] **B17.5** Create `BookingsList` — owner view of all bookings for their grounds

---

## Phase 18 — Profile & Ratings

- [ ] **B18.1** Create `ProfilePage` — digital cricket card view, discipline rating display, role toggle (player ↔ owner)
- [ ] **B18.2** Create `EditProfileModal` — update name, role, photo
- [ ] **B18.3** Create `RatingModal` — 1-5 star rating with optional comment (post-match)
- [ ] **B18.4** Create `MyBookingsPage` — player's booking history with status badges

---

## Phase 19 — Animations & Polish (GSAP)

- [ ] **B19.1** Page transition animations (slide-in from right)
- [ ] **B19.2** Modal fade + vertical lift animations
- [ ] **B19.3** Button micro-interactions (scale 0.98 on tap)
- [ ] **B19.4** Staggered list animations on all card feeds
- [ ] **B19.5** Star fill animation on rating submission
- [ ] **B19.6** Particle background component (React Bits inspired)

---

# 🔗 Track C — Integration

---

## Phase 20 — Connect Frontend to Backend

- [ ] **C20.1** Wire auth flow: Login → Firebase OTP → Backend verify → Store user in Redux
- [ ] **C20.2** Wire profile: Fetch/update user profile via API
- [ ] **C20.3** Wire match discovery: Geolocation → API nearby query → Display in feed
- [ ] **C20.4** Wire match actions: Create, join, confirm
- [ ] **C20.5** Wire ground discovery: Geolocation → API nearby query → Display grounds
- [ ] **C20.6** Wire booking flow: Select slot → Create booking API → Payment → Verify
- [ ] **C20.7** Wire owner dashboard: Ground CRUD, slot management, earnings API
- [ ] **C20.8** Wire ratings: Post-match rating submission + display

---

## Phase 21 — Cloud Services Integration

- [ ] **C21.1** Setup Firebase project, enable phone authentication
- [ ] **C21.2** Setup Cloudinary account, test image upload flow
- [ ] **C21.3** Setup MongoDB Atlas cluster, configure connection string
- [ ] **C21.4** (Optional) Setup Razorpay/Stripe test mode for payments

---

## Phase 22 — Testing & QA

- [ ] **C22.1** Test complete player journey: Login → Profile → Discover → Join → Confirm → Rate
- [ ] **C22.2** Test complete owner journey: Login → Create Ground → Manage Slots → View Bookings → Earnings
- [ ] **C22.3** Test role toggle: Switch between player and owner mode
- [ ] **C22.4** Test responsive design: Mobile, Tablet, Desktop
- [ ] **C22.5** Test edge cases: Double booking prevention, invalid OTP, empty states

---

## Phase 23 — Deployment

- [ ] **C23.1** Deploy backend to Render/Railway
- [ ] **C23.2** Deploy frontend to Vercel/Netlify
- [ ] **C23.3** Configure production environment variables
- [ ] **C23.4** Final smoke test on production URLs

---

# Summary

| Track | Phases | Estimated Tasks |
|-------|--------|-----------------|
| **Phase 0** — Scaffolding | 1 phase | 7 tasks |
| **Track A** — Backend | 10 phases | ~35 tasks |
| **Track B** — Frontend | 9 phases | ~40 tasks |
| **Track C** — Integration | 4 phases | ~17 tasks |
| **Total** | **24 phases** | **~99 tasks** |

---

> [!NOTE]
> Once approved, I will execute each phase sequentially, starting with Phase 0 (Project Scaffolding), then Track A (Backend), Track B (Frontend), and finally Track C (Integration). Each phase will be committed as a logical unit.
