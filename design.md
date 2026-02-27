# Design Specification: Cricket Connect  
## Modern UI/UX System (MVP)

---

# 1. Design Philosophy

## 1.1 Core Concept  
**“The Digital Pavilion 2.0”**

A modern, athletic, immersive cricket ecosystem that feels:
- Fast
- Lightweight
- Energetic
- Social
- Professional

The design combines:
- Clean utility-driven layouts
- Subtle motion design
- Immersive animated backgrounds using **React Bits – Particles**

---

# 2. Visual Identity

## 2.1 Design Language

| Principle | Implementation |
|------------|----------------|
| Minimal but expressive | Large iconography, bold headers |
| Motion-first | Micro-interactions & smooth transitions |
| Tap > Type | Chips, sliders, toggle buttons |
| Depth without clutter | Soft shadows + layered cards |
| Immersive | Dynamic particle background |

---

## 2.2 Color System

### Primary Palette

| Name | Hex | Usage |
|------|------|--------|
| Primary Green | `#28A745` | CTAs, Success states |
| Deep Navy | `#1A237E` | Headers, Navigation |
| Action White | `#FFFFFF` | Cards & Content |
| Warning Red | `#DC3545` | Alerts, No-show indicators |
| Surface Dark | `#0F172A` | Dark mode backgrounds |
| Accent Lime | `#4ADE80` | Active states |

---

## 2.3 Typography

Primary Font: **Inter** (Google Fonts)

Hierarchy:

| Usage | Size | Weight |
|--------|------|--------|
| H1 | 28–32px | 700 |
| H2 | 22–24px | 600 |
| Body | 16px | 400 |
| Caption | 12–14px | 500 |

Responsive Typography:
- `clamp()` for scalable headings
- Line height: 1.4–1.6 for readability

---

# 3. Background System (React Bits – Particles)

## 3.1 Particle Background Strategy

We use **React Bits “Particles”** as a subtle animated background layer.

### Behavior:
- Slow floating particles
- Cricket-field inspired green glow
- Slight parallax effect on scroll
- Reduced density on mobile for performance

### Placement:
- Authentication screens
- Home dashboard hero
- Empty states

### Performance Rules:
- Max 60fps
- GPU-accelerated transforms
- Auto-disable heavy effects on low-power devices
- `prefers-reduced-motion` respected

### Layer Structure:
4. Layout System
4.1 Grid System

Mobile-first approach

4px spacing system

Max width: 1280px (Desktop)

Container padding:

Mobile: 16px

Tablet: 24px

Desktop: 32px

Breakpoints:

Device	Width
Mobile	0–639px
Tablet	640–1023px
Laptop	1024–1279px
Desktop	1280px+
4.2 Responsive Strategy
Mobile (Primary Experience)

Bottom Tab Navigation

FAB for “Create Match”

Card-based vertical scroll

Sticky action buttons

Tablet

Two-column layouts

Split match details view

Expanded slot calendar grid

Desktop

Sidebar navigation

3-column dashboards

Persistent earnings widget

Wider slot grid with hover tooltips

5. Core UI Components
5.1 Action Card

Style

Border radius: 16px

Soft shadow: shadow-lg

Backdrop blur (glass effect on hero)

Interaction

Scale: 0.98 on tap

Hover glow (desktop)

Smooth GSAP easing

Used for:

Match cards

Ground listings

Booking summaries

5.2 Buttons
Primary Button

Background: Primary Green

Rounded: 12px

Height: 48px (min tap size)

Full-width on mobile

Secondary Button

Outlined Deep Navy

Subtle hover fill

Danger Button

Warning Red

Confirmation dialogs only

5.3 Navigation
Mobile Navigation

Bottom Tab Bar:

Home

My Matches

Ground Search

Profile

Icons only (with labels)
Frosted glass background
Safe-area aware (iOS)

Desktop Navigation

Left Sidebar:

Icon + Label

Collapsible

Active state highlight

5.4 Floating Action Button (FAB)

Position: Bottom-right

Circular

Elevation shadow

Pulsing animation (subtle)

Visible only on:

Home screen (Player Mode)

5.5 Slot Grid (Owner)

Mobile:

Horizontal scroll timeline

Tap to block

Tablet/Desktop:

Full calendar grid

Hover preview

Color-coded slots:

Green = Available

Yellow = Reserved

Red = Blocked

6. Interaction Design
6.1 Micro-Interactions
Action	Animation
Button tap	Scale down 0.98
Payment success	Animated checkmark
Match confirmed	Green glow border
Rating submitted	Star fill animation
6.2 Page Transitions

Using GSAP:

Slide-in from right (new screen)

Fade + slight vertical lift for modals

Staggered list animation (opacity + y)

Duration:

200–300ms max

7. Experience Principles
7.1 Tap > Typing

Replace inputs with:

Sliders for Overs

Chips for Match Type

Toggle switches

Step-based flows

7.2 Progressive Disclosure

Show slots only after date selected

Show earnings breakdown only when expanded

Show advanced filters behind toggle

7.3 Feedback First

Every action must give:

Visual confirmation

Motion confirmation

State update within 200ms

8. Accessibility Standards

WCAG AA contrast compliance

Minimum tap target: 44x44px

ARIA labels for icons

Keyboard navigation support (desktop)

Dark mode support

Reduced motion fallback

9. Dark Mode

Dark mode is default for immersive sports feel.

Dark Theme Colors:

Background: #0F172A

Card: #1E293B

Text: #F8FAFC

Accent Green slightly brighter

Particles adapt:

Lower opacity

Cooler green tint

10. Performance & Optimization

Lazy load heavy components

Code splitting per route

Memoized lists

Particle density adaptive

Images optimized via Cloudinary

Target:

Lighthouse score 90+

First Contentful Paint < 2s

11. Empty States & Delight

Empty match list:

Animated floating cricket ball

Friendly message

Clear CTA

Booking success:

Confetti burst (subtle)

Animated success check

12. Design Deliverables

Figma Component Library

Responsive layout system

Tailwind config tokens

GSAP animation presets

Particle background component

Final Design Goal

Cricket Connect should feel:

Fast like a T20.
Smooth like a cover drive.
Reliable like a test match.