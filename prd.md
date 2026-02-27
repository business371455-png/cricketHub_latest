# Product Requirements Document (PRD)  
# Cricket Connect (MVP)

---

## 1. Executive Summary

**Cricket Connect** is a mobile-first MERN stack application designed to streamline the organization of cricket matches between players and ground owners.  

The platform connects:
- Players looking for teams and matches  
- Ground owners offering bookable cricket facilities  

The app emphasizes a **“tap-heavy, type-light”** user experience optimized for users actively on the field.

---

## 2. Vision & Objectives

### 2.1 Vision
To become the go-to digital infrastructure for organizing amateur and semi-pro cricket matches.

### 2.2 Core Objectives (MVP)
- Reduce match coordination friction
- Minimize last-minute cancellations and no-shows
- Improve ground slot utilization
- Enable seamless match discovery and booking

---

## 3. Target Audience

### 3.1 Players
- Amateur and semi-pro cricketers
- Individuals looking to join matches
- Teams looking for players
- Users comfortable with WhatsApp-based communication

### 3.2 Ground Owners
- Box cricket facility owners
- Open-field operators
- Sports facility managers
- Entrepreneurs seeking digital booking management

---

## 4. Functional Requirements

---

## 4.1 User Authentication

### 4.1.1 OTP Login
- Mobile number-only login
- OTP-based authentication via Firebase or Twilio
- No email/password required

**Acceptance Criteria:**
- User receives OTP within 30 seconds
- OTP expires in 5 minutes
- Login success rate > 95%

### 4.1.2 Role Toggle
- Single account supports:
  - Player mode
  - Owner mode
- Toggle available from Profile screen

**Acceptance Criteria:**
- Switching roles updates UI instantly
- No re-authentication required

---

## 4.2 Player Features

### 4.2.1 Smart Profile (Digital Cricket Card)

Fields:
- Name
- Role (Batsman, Bowler, All-rounder, Wicketkeeper)
- Discipline Rating (0–5)
- Profile image
- Location (Geo-enabled)

**Discipline Rating Calculation:**
- Starts at 5.0
- Deducted for:
  - No-show
  - Late cancellation
- Improved via consistent attendance

---

### 4.2.2 Match Discovery

- Geolocation-based discovery
- Filter by:
  - Match Type (Tennis, Leather, Box)
  - Players Needed
  - Date
  - Distance radius

**Acceptance Criteria:**
- Uses geospatial MongoDB query
- Results load under 2 seconds
- Matches sorted by proximity

---

### 4.2.3 Team Creation

3-Step Flow:
1. Enter Team Name
2. Select Match Type
3. Set Players Needed & Overs

System auto-generates:
- WhatsApp group invite link
- Match listing

**Acceptance Criteria:**
- Team creation takes < 60 seconds
- WhatsApp link auto-attached to match object

---

### 4.2.4 Match Commitment (No-Show Prevention)

- 24-hour prior push notification
- "Confirm Match" popup
- Auto-cancel if majority do not confirm

**Acceptance Criteria:**
- Reminder sent exactly 24 hours before
- Confirmation updates match status
- No-show penalty impacts discipline rating

---

## 4.3 Ground Owner Features

---

### 4.3.1 Ground Listing

Fields:
- Name
- Multi-image upload
- Amenities (Lights, Water, Parking)
- Price per hour
- Map Pin (GeoJSON location)

**Acceptance Criteria:**
- Minimum 1 image required
- Geolocation mandatory
- Amenities selectable via tags

---

### 4.3.2 Dynamic Slot Management

- Hourly grid interface
- Block slots for:
  - Maintenance
  - Offline/manual bookings
- Real-time availability updates

**Acceptance Criteria:**
- Owners can block/unblock instantly
- Double-booking prevented at DB level
- Slot status: Available | Reserved | Blocked

---

### 4.3.3 Earnings Dashboard

Displays:
- Daily revenue
- Weekly revenue
- Monthly revenue
- Total bookings

**Acceptance Criteria:**
- Revenue auto-updates on successful payment
- Graph view (daily/monthly)
- Data refresh under 2 seconds

---

## 4.4 Core Transactions

---

### 4.4.1 Booking Flow

Flow:
1. Select Date
2. Select Slot
3. Pay Advance
4. Receive Confirmation

**System Behavior:**
- Slot temporarily locked during payment
- Confirmation sent after successful payment
- Booking stored in DB

---

### 4.4.2 Post-Match Ratings

Mutual Rating System:
- Player → Ground
- Player → Player

Scale:
- 1 to 5 stars

Impact:
- Affects discipline rating
- Affects ground visibility ranking

---

## 5. User Journey Map (High-Level)

### Player Journey
1. OTP Login  
2. Complete Profile  
3. Discover Match  
4. Join/Create Team  
5. Confirm Match (24h prior)  
6. Play Match  
7. Rate Participants  

### Owner Journey
1. OTP Login  
2. Create Ground Listing  
3. Manage Slots  
4. Accept Bookings  
5. Receive Payment  
6. Track Earnings  

---

## 6. Success Metrics (KPIs)

### 6.1 Fill Rate
- % of ground slots booked via app
- Target: 60%+ within first 3 months

### 6.2 No-Show Rate
- % of matches cancelled within 24 hours
- Target: < 10%

### 6.3 Conversion Rate
- % of users completing profile after OTP login
- Target: 75%+

### 6.4 Retention (30-Day)
- % of active users returning within 30 days
- Target: 40%+

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load under 2 seconds
- API response under 500ms (avg)

### 7.2 Scalability
- Designed for multi-city expansion
- Cloud-hosted backend

### 7.3 Security
- OTP-based authentication
- Secure payment gateway integration
- Role-based access control
- Input validation & rate limiting

### 7.4 Reliability
- 99% uptime target
- Graceful error handling

---

## 8. Technical Stack (MVP)

| Layer       | Technology         |
|------------|--------------------|
| Frontend   | React.js (Vite)    |
| Styling    | Tailwind CSS       |
| Animations | GSAP               |
| State      | Redux Toolkit      |
| Backend    | Node.js / Express  |
| Database   | MongoDB            |
| Auth       | Firebase Auth      |
| Storage    | Cloudinary         |

---

## 9. Database Collections (High-Level)

- Users
- Grounds
- Matches
- Bookings
- Ratings

(Refer to tech-stack.md for detailed schema definitions.)

---

## 10. MVP Scope Boundaries

### Included
- OTP authentication
- Match creation & discovery
- Ground booking
- Rating system
- Basic earnings dashboard

### Not Included (Future Phases)
- In-app chat
- Tournament brackets
- AI-based team balancing
- Subscription plans
- Sponsorship marketplace

---

## 11. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| No-shows remain high | Discipline rating enforcement |
| Low ground onboarding | Incentivized early adopter pricing |
| Payment failures | Retry logic & slot locking system |
| GPS inaccuracies | Manual location override |

---

## 12. Future Roadmap (Post-MVP)

- Push notifications
- Subscription for premium listing
- Player skill verification badges
- AI match recommendations
- City-based leaderboards

---

# End of Document