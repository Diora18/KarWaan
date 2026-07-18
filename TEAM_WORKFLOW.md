# Enterprise Carpooling Platform - Team Workflow

Use this file with `team_specification.md` and `architecture_recommendation.md` before starting implementation. The goal is that every teammate can build independently while still connecting cleanly.

## Document Order

1. `team_specification.md` is the source of truth for API routes, payloads, screens, database fields, and WebSocket events.
2. `architecture_recommendation.md` explains why the architecture works and how to implement the major backend flows.
3. This file defines team ownership, MVP boundaries, and daily coordination rules.

## Locked MVP Scope

Build these first:

*   Authentication with organization selection and admin approval.
*   Employee dashboard with Find a Ride and Offer a Ride modes.
*   Vehicle management for employees and admins.
*   Ride search, route confirmation, publishing, booking, cancellation, and My Trips.
*   Active trip status updates, live location, chat, and native call link.
*   Wallet recharge through Razorpay Test Mode and ride fare payment records.
*   Ride history and reports summary.
*   Admin employees, vehicles, and settings tabs.

Treat these as bonus after MVP works:

*   Push notifications.
*   Intelligent route optimization beyond radial matching.
*   Phone number masking.
*   Advanced analytics charts.
*   Recurring ride automation beyond basic `isRecurring` data capture.

## Final Tech Choices

*   Frontend: React + Vite.
*   Routing: React Router DOM.
*   Server state: React Query.
*   Styling: Tailwind CSS + Shadcn UI.
*   Maps: Google Maps Platform with `@react-google-maps/api`.
*   Backend: Node.js + Express.js.
*   Database: MongoDB + Mongoose.
*   Realtime: Socket.io.
*   Cache: Redis for active trip telemetry.
*   Scheduler: Node-Cron.
*   Payments: Razorpay Test Mode.
*   Auth: JWT Bearer token in `Authorization` header.

## Suggested 4-Person Ownership

*   **Frontend Employee Flow**: auth screens, dashboard, saved places, Find Ride, Offer Ride, My Trips, Ride History.
*   **Frontend Admin Flow**: admin layout, employees tab, vehicles tab, settings tab, reports UI.
*   **Backend Core APIs**: auth, users, organizations, vehicles, rides, bookings, admin APIs, validation, auth middleware.
*   **Realtime/Payments/Reports**: Socket.io, Redis telemetry, chat persistence, wallet, ride fare payments, reports aggregation.

Each owner should add or update the matching API contract in `team_specification.md` before changing implementation.

## Integration Rules

*   All protected REST calls send `Authorization: Bearer <JWT_TOKEN>`.
*   All coordinates are `[lng, lat]`.
*   Ride search query parameter is `seats`.
*   Frontend uses backend enum values exactly for statuses.
*   Backend must filter organization-scoped data using `organizationId`.
*   Admin APIs must check `role === 'Admin'`.
*   Vehicle publishing must require at least one active vehicle.
*   Booking must reduce available ride seats atomically.
*   Cancellation must restore seats if the ride has not started.
*   Wallet payment must create a transaction record and update booking payment status.

## Environment Variables

Backend:

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
REDIS_URL=
GOOGLE_MAPS_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLIENT_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=
VITE_RAZORPAY_KEY_ID=
```

## Shared Branch And PR Rules

*   One branch per feature, named like `feature/auth-flow` or `feature/ride-search`.
*   Every PR should mention which screens and API routes it touches.
*   No route, payload, enum, or schema field should change without updating `team_specification.md`.
*   Backend PRs should include sample request/response JSON.
*   Frontend PRs should include screenshots or a short screen recording when UI changes.

## Daily Sync Checklist

Use this during team sync:

*   Which API contracts changed?
*   Which screens are blocked by backend data?
*   Which backend routes are blocked by frontend requirements?
*   Are schema changes backward compatible with existing seed/test data?
*   Are any status names, query params, or coordinate shapes drifting from the spec?

## Seed Data Needed

Create seed records for:

*   One organization: `Odoo Pvt. Ltd.` with domain `odoo.com`.
*   One admin user with `status: Active`.
*   Three employee users: one `Pending`, one `Active`, one `Revoked`.
*   Two active vehicles and one inactive vehicle.
*   Three scheduled rides with different seat counts and departure times.
*   One booked trip with chat and telemetry test data.
*   Sample wallet transactions and completed ride history.
