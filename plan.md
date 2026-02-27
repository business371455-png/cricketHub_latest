# 🏏 Cricket Connect — Master Implementation Plan (MVP)

---

## Overview

This plan breaks the Cricket Connect MVP into **three major tracks**: Backend, Frontend, and Integration. Each track is further broken into **sequential phases** with clear deliverables. Tasks are ordered by dependency — earlier tasks are prerequisites for later ones.

> [!IMPORTANT]
> This plan assumes a fresh project setup. All work happens inside `c:\Users\Karan\OneDrive\Desktop\CricketHUb`.

---

# Phase 0 — Project Scaffolding

- [x] **0.1** Initialize monorepo structure with `client/` and `server/` folders
- [x] **0.2** Initialize backend: `npm init` inside `server/`, install core dependencies (express, mongoose, cors, dotenv, helmet, morgan, express-rate-limit, joi)
- [x] **0.3** Initialize frontend: `npx create-vite@latest ./` inside `client/` with React + JS template
- [x] **0.4** Install frontend dependencies (react-router-dom, @reduxjs/toolkit, react-redux, gsap, tailwindcss, axios)
- [x] **0.5** Configure Tailwind CSS with design tokens from `design.md` (colors, fonts, breakpoints)
- [x] **0.6** Create `.env.example` files for both client and server with placeholder keys
- [x] **0.7** Setup `nodemon` for backend dev server, confirm `vite dev` works for frontend

---

# 🔧 Track A — Backend (Node.js / Express)

---

## Phase 1 — Server Foundation

- [x] **A1.1** Create Express app entry point (`server/index.js`) with middleware stack (cors, helmet, morgan, json parser, rate limiter)
- [x] **A1.2** Create config module (`server/config/db.js`) for MongoDB Atlas connection via Mongoose
- [x] **A1.3** Create centralized error handler middleware (`server/middleware/errorHandler.js`)
- [x] **A1.4** Create async handler utility (`server/utils/asyncHandler.js`) for wrapping async route handlers
- [x] **A1.5** Setup environment-based config (`server/config/env.js`) loading from `.env`
- [x] **A1.6** Verify server boots, connects to MongoDB, and returns health check at `GET /api/health`

---

## Phase 2 — Database Models (Mongoose)

- [x] **A2.1** **User Model** (`server/models/User.js`)
  - Fields: phone, name, role (Batsman/Bowler/All-rounder/Wicketkeeper), profileImage, disciplineRating (default 5.0), isOwner, location (GeoJSON Point), createdAt
  - 2dsphere index on `location`

- [x] **A2.2** **Ground Model** (`server/models/Ground.js`)
  - Fields: ownerId (ref User), name, images[], amenities[], pricePerHour, slots[] (startTime, endTime, status), location (GeoJSON Point), ratings, createdAt
  - 2dsphere index on `location`

- [x] **A2.3** **Match Model** (`server/models/Match.js`)
  - Fields: creatorId (ref User), teamName, matchType (Tennis/Leather/Box), playersNeeded, players[] (ref User), status (Open/Confirmed/Completed/Cancelled), groundId (ref Ground), whatsappLink, startTime, createdAt

- [x] **A2.4** **Booking Model** (`server/models/Booking.js`)
  - Fields: groundId (ref Ground), userId (ref User), slotStart, slotEnd, paymentStatus (Pending/Paid/Failed), transactionId, amount, createdAt

- [x] **A2.5** **Rating Model** (`server/models/Rating.js`)
  - Fields: fromUser, toUser (optional), toGround (optional), matchId, score (1-5), comment, createdAt

- [ ] **A2.6** **Team Model** (`server/models/Team.js`) ← **NEW**
  - Fields: name, matchType (Tennis/Leather/Box), captain (ref User), members[] (ref User), maxSize (Number, default 11), whatsappLink, status (Active/Disbanded), createdAt

- [ ] **A2.7** **Modify Match Model** — Add `overs` field (Number, required) ← **NEW**

---

## Phase 3 — Authentication API

- [x] **A3.1** Create OTP-based auth (`server/controllers/authController.js`): send-otp, verify-otp with JWT
- [x] **A3.2** Create auth middleware (`server/middleware/auth.js`) to verify JWT from `Authorization` header
- [x] **A3.3** Create auth routes (`server/routes/authRoutes.js`)

---

## Phase 4 — User API

- [x] **A4.1** Create user controller (`server/controllers/userController.js`): getProfile, updateProfile, toggleOwnerRole
- [x] **A4.2** Create user routes (`server/routes/userRoutes.js`) — all protected
- [x] **A4.3** Add Joi validation schemas for user update

---

## Phase 5 — Ground API

- [x] **A5.1** Create ground controller with CRUD + slot management + nearby query
- [x] **A5.2** Create ground routes (`server/routes/groundRoutes.js`)
- [x] **A5.3** Add Joi validation for ground creation

---

## Phase 6 — Match API

- [x] **A6.1** Create match controller: create, getNearby, getById, join, confirm, cancel
- [x] **A6.2** Create match routes (`server/routes/matchRoutes.js`)
- [x] **A6.3** Add validation for match creation

- [ ] **A6.4** **Add `leaveMatch` endpoint** — `PUT /api/matches/:id/leave` (remove user from players[], update status if needed) ← **NEW**
- [ ] **A6.5** **Add `getMyMatches` endpoint** — `GET /api/matches/my` (return matches where user is in players[]) ← **NEW**
- [ ] **A6.6** **Update `createMatch`** to accept `overs` field ← **NEW**
- [ ] **A6.7** **Fix geospatial query** in `getNearbyMatches` — use MongoDB `$near` with coordinates ← **NEW**

---

## Phase 7 — Booking API

- [x] **A7.1** Create booking controller: create, verifyPayment, getMyBookings, getGroundBookings
- [x] **A7.2** Create booking routes
- [x] **A7.3** Implement slot-locking logic

---

## Phase 8 — Ratings API

- [x] **A8.1** Create rating controller: submit, getForGround
- [x] **A8.2** Create rating routes
- [ ] **A8.3** **Implement discipline rating recalculation** on new rating submission ← **NEW**

---

## Phase 9 — Owner Earnings API

- [x] **A9.1** Create earnings controller
- [x] **A9.2** Create earnings routes

---

## Phase 10 — Team API ← **NEW PHASE**

- [ ] **A10.1** Create team controller (`server/controllers/teamController.js`):
  - `POST /api/teams` — Create team (user becomes captain)
  - `GET /api/teams/my` — Get user's teams
  - `GET /api/teams/:id` — Get team details with members
  - `PUT /api/teams/:id/join` — Join team (add to members[])
  - `PUT /api/teams/:id/leave` — Leave team (remove from members[])
  - `DELETE /api/teams/:id` — Disband team (captain only)
- [ ] **A10.2** Create team routes (`server/routes/teamRoutes.js`) — all protected
- [ ] **A10.3** Add Joi validation (`server/validators/teamValidator.js`)
- [ ] **A10.4** Mount team routes in `server/index.js`

---

## Phase 11 — Backend Utilities & Polish

- [x] **A11.1** Mount all routers in main `index.js`
- [x] **A11.2** Add Cloudinary upload utility + multer config
- [x] **A11.3** Add image upload endpoint `POST /api/upload`
- [ ] **A11.4** Final sanity test: all endpoints respond correctly

---

# 🎨 Track B — Frontend (React + Vite)

---

## Phase 12 — App Shell & Design System

- [x] **B12.1** Configure Tailwind with design tokens (colors, fonts, breakpoints)
- [x] **B12.2** Create global CSS base styles — dark mode default
- [x] **B12.3** Setup React Router with route structure
- [x] **B12.4** Create layout components: BottomTabNav, Sidebar, FAB, AppLayout

---

## Phase 13 — Redux Store

- [x] **B13.1** Configure Redux store
- [x] **B13.2** Create `authSlice`
- [x] **B13.3** Create `matchSlice`
- [x] **B13.4** Create `groundSlice`
- [x] **B13.5** Create `bookingSlice`
- [ ] **B13.6** Create `teamSlice` — teams list, current team, loading states ← **NEW**

---

## Phase 14 — API Service Layer

- [x] **B14.1** Create Axios instance with base URL and token interceptor
- [x] **B14.2** Create `authService.js`
- [x] **B14.3** Create `matchService.js`
- [x] **B14.4** Create `groundService.js`
- [x] **B14.5** Create `bookingService.js`
- [x] **B14.6** Create `ratingService.js`
- [x] **B14.7** Create `uploadService.js`
- [x] **B14.8** Create `earningsService.js`
- [x] **B14.9** Create `userService.js`
- [ ] **B14.10** Create `teamService.js` — createTeam, getMyTeams, getTeamById, joinTeam, leaveTeam, deleteTeam ← **NEW**

---

## Phase 15 — Authentication Pages

- [x] **B15.1** Create `LoginPage` — phone + OTP input, mock OTP (Firebase future)
- [x] **B15.2** Create `ProfileSetupPage` — name, role, image upload, location
- [x] **B15.3** Add particle background on login screen
- [x] **B15.4** Wire up authSlice + authService

---

## Phase 16 — Player Dashboard

- [x] **B16.1** Create `PlayerHome` — match discovery feed with filters
- [x] **B16.2** Create `MatchCard` component
- [x] **B16.3** Create `MatchDetailPage` — match info, join button, player list
- [x] **B16.4** Create `CreateMatchModal` — 3-step flow

- [ ] **B16.5** **Add "Leave Match" button** in `MatchDetail.jsx` ← **NEW**
- [ ] **B16.6** **Create `MyMatches` page** — matches user has joined/created ← **NEW**
- [ ] **B16.7** **Add overs selection** (slider) in `CreateMatchModal` ← **NEW**
- [ ] **B16.8** GSAP staggered card entry animation ← **PENDING**
- [ ] **B16.9** FAB triggers CreateMatchModal ← **VERIFY**
- [ ] **B16.10** Empty state with animated cricket ball illustration ← **PENDING**

---

## Phase 17 — Team System ← **NEW PHASE**

- [ ] **B17.1** Create `MyTeams.jsx` — list of user's teams with `TeamCard` components
- [ ] **B17.2** Create `TeamCard.jsx` — team name, type, member count, captain name
- [ ] **B17.3** Create `TeamDetail.jsx` — team info, member list, join/leave buttons, WhatsApp link
- [ ] **B17.4** Create `CreateTeamModal.jsx` — 3-step flow:
  1. Enter team name
  2. Select match type (chips)
  3. Set max players & WhatsApp link
- [ ] **B17.5** Add `/my-teams` and `/teams/:id` routes to `App.jsx`
- [ ] **B17.6** Add "My Teams" to bottom tab navigation

---

## Phase 18 — Ground Discovery & Booking

- [x] **B18.1** Create `GroundSearchPage` — nearby grounds list
- [x] **B18.2** Create `GroundCard` component
- [x] **B18.3** Create `GroundDetailPage` — images, amenities, map pin, booking

- [ ] **B18.4** **Create `SlotGrid` component** — date picker + hourly grid (color-coded: green/yellow/red) ← **NEW**
- [ ] **B18.5** Create `BookingFlow` — select date → select slot → confirm → payment → success animation ← **PENDING**
- [ ] **B18.6** Add GSAP confetti/success animation on booking confirmation ← **PENDING**

---

## Phase 19 — Owner Dashboard

- [x] **B19.1** Create `OwnerHome` — ground management overview
- [x] **B19.2** Create `GroundListingForm` — name, images, amenities, price, location

- [ ] **B19.3** **Create `SlotManager` component** — calendar view, tap to block/unblock slots ← **NEW**
- [ ] **B19.4** **Create `EarningsChart` component** — daily/weekly/monthly revenue chart ← **NEW**
- [ ] **B19.5** **Create `BookingsList`** — owner view of all bookings for their grounds ← **NEW**

---

## Phase 20 — Profile & Ratings

- [x] **B20.1** Create `ProfilePage` — digital cricket card view, discipline rating display

- [ ] **B20.2** **Create `EditProfileModal`** — update name, role, photo ← **NEW**
- [ ] **B20.3** **Add Role Toggle button** (player ↔ owner) to Profile page ← **NEW**
- [ ] **B20.4** **Add Sign Out button** to Profile page ← **NEW**
- [ ] **B20.5** **Create `RatingModal`** — 1-5 star rating with optional comment ← **NEW**
- [ ] **B20.6** **Create `MyBookingsPage`** with status badges ← **PENDING**

---

## Phase 21 — Animations & Polish (GSAP)

- [ ] **B21.1** Page transition animations (slide-in from right) ← **PENDING**
- [ ] **B21.2** Modal fade + vertical lift animations ← **PENDING**
- [ ] **B21.3** Button micro-interactions (scale 0.98 on tap) ← **PENDING**
- [ ] **B21.4** Staggered list animations on all card feeds ← **PENDING**
- [ ] **B21.5** Star fill animation on rating submission ← **PENDING**
- [ ] **B21.6** Particle background component — ✅ already exists

---

# 🔗 Track C — Integration

---

## Phase 22 — Connect Frontend to Backend

- [x] **C22.1** Wire auth flow: Login → OTP → Backend verify → Store user in Redux
- [x] **C22.2** Wire profile: Fetch/update user profile via API

- [ ] **C22.3** Wire match discovery: Geolocation → API nearby query → Display in feed ← **FIX geospatial**
- [ ] **C22.4** Wire match actions: Create, join, **leave**, confirm ← **ADD leave**
- [ ] **C22.5** Wire ground discovery
- [ ] **C22.6** Wire booking flow: Select slot → Create booking API → Payment → Verify
- [ ] **C22.7** Wire owner dashboard: Ground CRUD, **slot management**, **earnings chart**
- [ ] **C22.8** Wire ratings: Post-match rating submission + display
- [ ] **C22.9** **Wire team system: Create, join, leave, disband teams** ← **NEW**

---

## Phase 23 — Cloud Services Integration

- [ ] **C23.1** Setup Firebase project, enable phone authentication
- [x] **C23.2** Setup Cloudinary account, test image upload flow
- [x] **C23.3** Setup MongoDB Atlas cluster, configure connection string
- [ ] **C23.4** (Optional) Setup Razorpay/Stripe test mode for payments

---

## Phase 24 — Testing & QA

- [ ] **C24.1** Test complete player journey: Login → Profile → Discover → Join → **Leave** → Confirm → Rate
- [ ] **C24.2** Test complete owner journey: Login → Create Ground → **Manage Slots** → **View Earnings Chart** → View Bookings
- [ ] **C24.3** Test role toggle: Switch between player and owner mode
- [ ] **C24.4** Test responsive design: Mobile, Tablet, Desktop
- [ ] **C24.5** Test edge cases: Double booking prevention, invalid OTP, empty states
- [ ] **C24.6** **Test team journey: Create team → Join team → Leave team → Disband team** ← **NEW**

---

## Phase 25 — Deployment

- [ ] **C25.1** Deploy backend to Render/Railway
- [ ] **C25.2** Deploy frontend to Vercel/Netlify
- [ ] **C25.3** Configure production environment variables
- [ ] **C25.4** Final smoke test on production URLs

---

# Summary

| Track | Phases | Status |
|-------|--------|--------|
| **Phase 0** — Scaffolding | ✅ Complete | All 7 tasks done |
| **Track A** — Backend | Phases 1-11 | Core done, **Team API + Match updates needed** |
| **Track B** — Frontend | Phases 12-21 | Core pages done, **Team pages + Profile enhancements + SlotGrid + Ratings + Animations needed** |
| **Track C** — Integration | Phases 22-25 | Partial, **Team wiring + missing features needed** |

> [!IMPORTANT]
> **New features to build (PRD gaps):**
> 1. 🏏 Team System (create / join / leave / disband)
> 2. 🚪 Leave Match functionality
> 3. ✏️ Edit Profile Modal + Role Toggle + Sign Out
> 4. 📅 Slot Grid (player view) + Slot Manager (owner view)
> 5. 📊 Earnings Chart
> 6. ⭐ Rating Modal
> 7. 📋 My Matches page
> 8. 🎯 Overs field in match creation
> 9. 🎨 GSAP animations throughout
