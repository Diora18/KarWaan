# Project Progress Tracker - Enterprise Carpooling Platform

This file tracks the status of frontend screens, backend endpoints, and integrated flows. Mark items as `[x]` as they are completed and pushed to Git.

---

## 1. Backend REST & WebSocket Services

### 🔑 Authentication & Organizations
- [ ] `GET /api/organizations` (Fetch partnered organizations list)
- [ ] `POST /api/auth/register` (Create user in `Pending` state, validate domains)
- [ ] `POST /api/auth/login` (Verify credentials & check active admin status)
- [ ] `GET /api/users/profile` (Fetch profile, saved places, and wallet balance)

### 🚗 Vehicle Management
- [ ] `GET /api/vehicles` (Fetch employee's active vehicles list)
- [ ] `POST /api/vehicles` (Register a new vehicle)

### 🗺️ Ride Search & Matching
- [ ] `POST /api/rides/publish` (Driver publishes a scheduled ride)
- [ ] `GET /api/rides/search` (Radial 5km proximity query matching pickup/dropoff locations)
- [ ] `POST /api/bookings` (Confirm seat booking and verify wallet funds availability)

### ⏱️ Live Tracking (Socket.io & Redis)
- [ ] Redis Telemetry Configuration (`HSET` telemetry hash & GeoSet indexing)
- [ ] WebSocket Room initialization (`join_trip_room`)
- [ ] WebSocket Live updates (`send_location` -> `location_update` broadcast)
- [ ] WebSocket In-trip instant messaging (`send_chat_message` -> `chat_message_received`)
- [ ] `PATCH /api/trips/:tripId/status` (Transitions trip lifecycle status)

### 💳 Wallet & Payments Sandbox
- [ ] `POST /api/wallet/recharge` (Generates simulated Razorpay order ID)
- [ ] `POST /api/wallet/verify-recharge` (Verifies signature hashes & credits wallet ledger)

### 🏢 Organization Admin Panel
- [ ] `GET /api/admin/employees` (Fetch pending/active employees queue)
- [ ] `PATCH /api/admin/employees/:id/access` (Approve user registration or revoke access)
- [ ] `GET /api/admin/vehicles` (List all registered enterprise vehicles)
- [ ] `PATCH /api/admin/vehicles/:id/status` (Toggle active status of vehicle)
- [ ] `GET /api/admin/settings` (Fetch fuel cost, operational markup configs)
- [ ] `PUT /api/admin/settings` (Save modified organization-wide settings)

---

## 2. Frontend Screens (React)

### 🔐 Authentication & Onboarding
- [ ] **Splash Screen** (Bootstrap assets, fetch token, redirect user)
- [ ] **Login Screen** (Organization dropdown, email/pass fields, status feedback)
- [ ] **Sign Up Screen** (Name, phone, email, organization selection validation)

### 👤 Employee Views (Core Features)
- [ ] **Dashboard** (Mode switcher card, wallet balance indicator, quick links)
- [ ] **Find a Ride** (Search inputs, route selection map, quick prefill shortcuts)
- [ ] **Available Rides List** (Search results cards, pricing summaries, "Book Now" trigger)
- [ ] **Offer a Ride** (Select vehicle, input route/fare parameters, route preview map)
- [ ] **Vehicle Registration** (Form fields to add model, reg number, seating capacity)

### ⏱️ Live Telemetry & Communication
- [ ] **Active Trip Screen** (Status transitions, "Start/Complete Trip" buttons)
- [ ] **Live Maps Tracking** (WebSocket client updates, moving driver marker, pickup pins)
- [ ] **Chat Drawer** (Scrollable message timeline client connected to trip room socket)
- [ ] **Native Caller Button** (Action link leveraging `<a href="tel:...">`)

### 💳 Payments & Wallet
- [ ] **Wallet Dashboard** (Balance displays, recharge forms, transaction tables)
- [ ] **Razorpay Sandbox overlay** (Integration checkout handling test transactions)

### 🏢 Admin Dashboard Tabs
- [ ] **Employees Tab** (Metrics summary cards, access approval/revoke table list)
- [ ] **Vehicles Tab** (Enterprise registered vehicles status toggles)
- [ ] **Settings Tab** (Company details forms, carpooling configuration inputs)

---

## 3. End-to-End Integration Status

- [ ] **Domain & Organization signup approval chain**
- [ ] **Search result route mapping & booking**
- [ ] **Driver location stream -> Passenger map tracking rendering**
- [ ] **Simulated Razorpay transaction callback & wallet update**
