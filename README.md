<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Payments-Razorpay-0D47A1?style=for-the-badge" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Maps-Google%20Maps-4285F4?style=for-the-badge&logo=google-maps" alt="Google Maps" />
</p>

# 🚗 KarWaan — Enterprise Carpooling Platform

> **"Ride Together, Save Together"**

KarWaan is a **multi-tenant enterprise carpooling platform** that enables employees within partnered organizations to share rides on their daily commute. Drivers publish available seats on their route, passengers search and book matching rides, and the platform handles real-time tracking, in-trip chat, and wallet-based fare payments — all scoped securely within each organization.

---

## 📌 Why KarWaan?

### The Problem

- **Rising fuel costs** make daily solo commuting increasingly expensive for employees.
- **Traffic congestion** in metro cities wastes hours every week, impacting productivity and well-being.
- **Carbon emissions** from single-occupancy vehicles are a growing environmental concern for ESG-conscious companies.
- **No organization-scoped solution** — public ride-sharing apps lack corporate-level trust, admin control, and domain-verified user bases.

### The Solution

KarWaan provides a **secure, organization-restricted carpooling ecosystem** where:

- ✅ Only **verified employees** (approved by org admins) can participate.
- 🗺️ Drivers publish rides with route, timing, seats, and fare — passengers find matching rides via **geospatial proximity search**.
- 📍 **Live GPS tracking** keeps passengers informed with real-time driver location and ETA updates.
- 💬 **In-trip chat** allows riders to coordinate pickup details without exchanging personal phone numbers.
- 💳 A **digital wallet** powered by Razorpay (test mode) handles cashless fare payments.
- 🏢 **Organization admins** manage employee access, vehicle registry, and cost configurations from a dedicated dashboard.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌───────────────────┐    ┌───────────────────┐        │
│  │  Employee Web App │    │   Admin Dashboard │        │
│  │  (React + Vite)   │    │   (React + Vite)  │        │
│  └────────┬──────────┘    └────────┬──────────┘        │
│           │ REST + WebSocket       │ REST               │
└───────────┼────────────────────────┼────────────────────┘
            │                        │
┌───────────▼────────────────────────▼────────────────────┐
│              Backend Service Layer                       │
│         Express.js REST API + Socket.io Server           │
│    (JWT Auth · Middleware · Controllers · Routes)        │
└──────┬─────────────────┬──────────────────┬─────────────┘
       │                 │                  │
┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼──────────────┐
│  MongoDB    │  │    Redis      │  │  External APIs      │
│  (Primary   │  │  (Telemetry   │  │  • Google Maps      │
│   Database) │  │   Cache +     │  │  • Razorpay Sandbox  │
│             │  │   GeoIndex)   │  │                      │
└─────────────┘  └───────────────┘  └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer         | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| **Frontend**  | React 19, Vite 8, React Router DOM, Leaflet/Google Maps, Socket.io-client |
| **Backend**   | Node.js, Express.js 4, Socket.io 4, Mongoose 8, Morgan          |
| **Database**  | MongoDB (with 2dsphere geospatial indexes)                       |
| **Cache**     | Redis (live telemetry + geo-indexed active trips)                |
| **Auth**      | JWT (Bearer token), bcryptjs                                     |
| **Payments**  | Razorpay (Test Mode / Sandbox)                                   |
| **Maps**      | Google Maps Platform (`@react-google-maps/api`), Leaflet          |
| **Scheduler** | Node-Cron (recurring rides, cleanup jobs)                        |

---

## ✨ Key Features

### 👤 Employee Experience
- **Organization-scoped Sign Up** — Register with your corporate email; admin approves your access.
- **Find a Ride** — Search for rides near your pickup & destination within a 5 km radius.
- **Offer a Ride** — Publish rides with vehicle selection, route, departure time, seats, and fare.
- **My Trips** — View upcoming and active trips; cancel bookings before departure.
- **Ride History** — Browse completed/cancelled rides with route, fare, and payment details.
- **Saved Places** — Quick-set Home & Office locations for faster ride searches.
- **Vehicle Management** — Register, edit, and deactivate personal vehicles.

### 📍 Real-time Tracking & Communication
- **Live GPS Tracking** — Driver location streams every 3 seconds via WebSocket → Redis → broadcast.
- **In-trip Chat** — Instant messaging between driver and passengers within the trip room.
- **Native Calling** — One-tap call button using the `tel:` protocol (no third-party voice API).

### 💳 Wallet & Payments
- **Wallet Recharge** — Top up via Razorpay checkout (test mode with sandbox credentials).
- **Ride Fare Payment** — Pay for rides using Wallet, Cash, UPI, or Card.
- **Transaction History** — Full ledger of recharges, fare payments, and payouts.

### 🏢 Admin Dashboard
- **Employees Tab** — View all registered employees; approve pending accounts or revoke access.
- **Vehicles Tab** — Manage the organization's vehicle registry; toggle active/inactive status.
- **Settings Tab** — Configure company details, fuel cost/liter, cost/km, and operational markup.
- **Summary KPIs** — Total employees, registered vehicles, and rides this month.

---

## 📁 Project Structure

```
KarWaan/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/             # Database connection config
│   │   ├── controllers/        # Route handlers (auth, rides, admin, wallet, etc.)
│   │   ├── middleware/         # JWT auth & role-based access middleware
│   │   ├── models/             # Mongoose schemas (User, Vehicle, Ride, Transaction, etc.)
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Socket.io event handlers
│   │   ├── utils/              # Helpers (Haversine distance, default orgs, etc.)
│   │   ├── app.js              # Express app setup (CORS, routes, morgan)
│   │   ├── server.js           # HTTP + Socket.io server entry point
│   │   └── seed.js             # Database seeder with demo data
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── FRONTEND/                   # React + Vite client
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, MapView, AddressAutocomplete, etc.)
│   │   ├── pages/              # Screen-level components (14 pages)
│   │   ├── lib/                # Utility modules
│   │   ├── App.jsx             # Root component with React Router
│   │   ├── main.jsx            # Vite entry point
│   │   └── styles.css          # Global stylesheet
│   ├── public/                 # Static assets
│   ├── .env.example            # Frontend environment template
│   ├── vite.config.js          # Vite dev server config
│   └── package.json
│
├── package.json                # Root workspace (runs frontend scripts)
├── team_specification.md       # API contracts & screen specifications
├── architecture_recommendation.md  # Architecture design document
├── TEAM_WORKFLOW.md            # Team coordination rules & MVP scope
└── progress.md                 # Development progress tracker
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

| Tool        | Version   | Download Link                                      |
| ----------- | --------- | -------------------------------------------------- |
| **Node.js** | ≥ 18 LTS  | [nodejs.org](https://nodejs.org/)                   |
| **MongoDB** | ≥ 6.0     | [mongodb.com](https://www.mongodb.com/try/download) |
| **Redis**   | ≥ 7.0     | [redis.io](https://redis.io/download)               |
| **Git**     | Any       | [git-scm.com](https://git-scm.com/)                |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Diora18/KarWaan.git
cd KarWaan
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create the environment file from the provided template:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/karwaan
JWT_SECRET=replace_with_a_long_random_secret
REDIS_URL=redis://127.0.0.1:6379
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
CLIENT_URL=http://localhost:4173
```

> **Note**: For local development without Google Maps or Razorpay, you can leave those keys blank — the core ride/auth features will still work.

---

### Step 3 — Seed the Database

Make sure MongoDB is running, then populate demo data:

```bash
npm run seed
```

This creates:
- 🏢 **1 Organization**: `Odoo Pvt. Ltd.` (domain: `odoo.com`)
- 👤 **1 Admin** + **3 Employees** (Active, Pending, Revoked)
- 🚗 **2 Vehicles** (1 Active, 1 Inactive)
- 🗺️ **1 Scheduled Ride** with preset route
- 💬 **1 Seed Chat Message** for testing
- 💰 **1 Wallet Transaction** (₹1,000 recharge)

---

### Step 4 — Start the Backend Server

```bash
npm run dev
```

The API server starts at **`http://localhost:5000`**. Verify it's running:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok", "service": "karwaan-backend" }
```

---

### Step 5 — Frontend Setup

Open a **new terminal** and run:

```bash
cd FRONTEND
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

The defaults should work out of the box:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
VITE_SOCKET_URL=http://127.0.0.1:5000
```

---

### Step 6 — Start the Frontend Dev Server

```bash
npm run dev
```

The React app starts at **`http://localhost:4173`**. Open it in your browser and you're ready to go! 🎉

---

## 🔑 Demo Credentials

After running `npm run seed`, use these accounts to explore the platform:

| Role         | Email               | Password       | Status   | Description                          |
| ------------ | ------------------- | -------------- | -------- | ------------------------------------ |
| **Admin**    | `admin@odoo.com`    | `Password123`  | Active   | Full admin dashboard access          |
| **Employee** | `khush@odoo.com`    | `Password123`  | Active   | Active employee with ₹1,000 wallet   |
| **Employee** | `pending@odoo.com`  | `Password123`  | Pending  | Blocked until admin approves         |
| **Employee** | `revoked@odoo.com`  | `Password123`  | Revoked  | Access revoked by admin              |

> **Organization**: Select **"Odoo Pvt. Ltd."** from the dropdown on the login/signup screen.

### Quick Test Walkthrough

1. **Login as Admin** (`admin@odoo.com`) → Go to the **Employees Tab** → Approve the `Pending Employee`.
2. **Login as Employee** (`khush@odoo.com`) → Browse the **Dashboard** → Try **Offer a Ride** or **Find a Ride**.
3. **Try the Pending Account** (`pending@odoo.com`) → See the approval-pending message → Switch back to Admin and approve.

---

## 📡 API Endpoint Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <JWT_TOKEN>`.

<details>
<summary><strong>🔓 Authentication & Organizations (Public)</strong></summary>

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/organizations`   | Fetch list of partnered organizations |
| POST   | `/api/auth/register`   | Register a new account (Pending)      |
| POST   | `/api/auth/login`      | Login and receive JWT token           |

</details>

<details>
<summary><strong>👤 User & Profile (Protected)</strong></summary>

| Method | Endpoint                  | Description                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/api/users/profile`      | Get logged-in user profile       |
| GET    | `/api/users/saved-places` | Get saved home/office locations  |
| PUT    | `/api/users/saved-places` | Create or update saved places    |

</details>

<details>
<summary><strong>🚗 Vehicles (Protected)</strong></summary>

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/vehicles`        | List user's vehicles         |
| POST   | `/api/vehicles`        | Register a new vehicle       |
| PATCH  | `/api/vehicles/:id`    | Update vehicle details       |
| DELETE | `/api/vehicles/:id`    | Deactivate/delete a vehicle  |

</details>

<details>
<summary><strong>🗺️ Rides & Bookings (Protected)</strong></summary>

| Method | Endpoint                       | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| POST   | `/api/rides/publish`           | Publish a ride offer              |
| GET    | `/api/rides/search`            | Search matching rides (geospatial)|
| GET    | `/api/rides/history`           | Get completed/cancelled rides     |
| POST   | `/api/bookings`                | Book seats on a ride              |
| PATCH  | `/api/bookings/:id/cancel`     | Cancel a booking                  |
| GET    | `/api/trips/my`                | Get user's active/upcoming trips  |
| PATCH  | `/api/trips/:tripId/status`    | Update trip lifecycle status      |

</details>

<details>
<summary><strong>💳 Wallet & Payments (Protected)</strong></summary>

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/wallet/transactions`     | Get transaction history            |
| POST   | `/api/wallet/recharge`         | Create Razorpay recharge order     |
| POST   | `/api/wallet/verify-recharge`  | Verify payment & credit wallet     |
| POST   | `/api/payments/ride-fare`      | Record ride fare payment           |

</details>

<details>
<summary><strong>📊 Reports (Protected)</strong></summary>

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/api/reports/summary`  | Trip, distance, fuel & cost analytics |

</details>

<details>
<summary><strong>🏢 Admin (Admin Only)</strong></summary>

| Method | Endpoint                              | Description                      |
| ------ | ------------------------------------- | -------------------------------- |
| GET    | `/api/admin/employees`                | List all org employees           |
| PATCH  | `/api/admin/employees/:id/access`     | Approve or revoke employee       |
| POST   | `/api/admin/employees`                | Add an employee directly         |
| GET    | `/api/admin/vehicles`                 | List all org vehicles            |
| POST   | `/api/admin/vehicles`                 | Register vehicle for employee    |
| PATCH  | `/api/admin/vehicles/:id/status`      | Toggle vehicle active/inactive   |
| GET    | `/api/admin/settings`                 | Get org configuration            |
| PUT    | `/api/admin/settings`                 | Update org settings              |

</details>

---

## 🔌 WebSocket Events (Real-time Tracking & Chat)

| Event                     | Direction          | Description                                         |
| ------------------------- | ------------------ | --------------------------------------------------- |
| `join_trip_room`          | Client → Server    | Join a trip's live tracking room                     |
| `room_joined`             | Server → Client    | Acknowledgement with initial trip state              |
| `send_location`           | Driver → Server    | Stream GPS coordinates every 3s                      |
| `location_update`         | Server → Passengers| Broadcast driver's latest position                   |
| `send_chat_message`       | Client → Server    | Send a text message in the trip chat                 |
| `chat_message_received`   | Server → Clients   | Broadcast received chat message                      |
| `trip_status_change`      | Server → Clients   | Notify trip lifecycle transitions                    |

---

## 🧩 Environment Variables Summary

### Backend (`backend/.env`)

| Variable              | Required | Description                              |
| --------------------- | -------- | ---------------------------------------- |
| `PORT`                | No       | Server port (default: `5000`)            |
| `MONGODB_URI`         | Yes      | MongoDB connection string                |
| `JWT_SECRET`          | Yes      | Secret key for signing JWT tokens        |
| `REDIS_URL`           | Yes      | Redis connection URL                     |
| `GOOGLE_MAPS_API_KEY` | No       | Google Maps API key (for route features) |
| `RAZORPAY_KEY_ID`     | No       | Razorpay test key ID                     |
| `RAZORPAY_KEY_SECRET` | No       | Razorpay test key secret                 |
| `CLIENT_URL`          | No       | Frontend origin for CORS                 |

### Frontend (`FRONTEND/.env`)

| Variable              | Required | Description                    |
| --------------------- | -------- | ------------------------------ |
| `VITE_API_BASE_URL`   | Yes      | Backend API base URL           |
| `VITE_SOCKET_URL`     | Yes      | WebSocket server URL           |

---

## 📜 Available Scripts

### Root Directory

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the frontend dev server        |
| `npm run build`   | Build frontend for production        |
| `npm run preview` | Preview the production build         |

### Backend (`cd backend`)

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start backend with nodemon (hot-reload) |
| `npm start`       | Start backend in production mode     |
| `npm run seed`    | Populate database with demo data     |
| `npm run smoke`   | Syntax-check the server entry point  |

### Frontend (`cd FRONTEND`)

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Follow the contracts in `team_specification.md` — update them if your changes modify API routes, payloads, or schemas.
3. Include sample request/response JSON in backend PRs.
4. Include screenshots or screen recordings in frontend PRs.
5. Open a Pull Request and reference the screens/routes you've touched.

See [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) for full team coordination rules.

---

## 📄 License

This project is for educational and demonstration purposes.

---

<p align="center">
  Built with ❤️ by the KarWaan Team
</p>