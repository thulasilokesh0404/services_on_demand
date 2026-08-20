# ServiceHub — Service On Demand Frontend

A production-style React + Tailwind CSS frontend based on the supplied ServiceHub UI reference.

## Included
- Responsive landing page
- Services listing + search/filter
- Service details
- Booking flow
- Login/register demo
- Customer dashboard
- Customer bookings
- Provider dashboard
- Admin dashboard
- Reusable navbar, footer, cards, dashboard shell
- LocalStorage demo booking/auth state
- Cropped visual assets from the supplied reference board

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Main routes

- `/`
- `/services`
- `/services/1`
- `/booking/1`
- `/login`
- `/register`
- `/customer`
- `/customer/bookings`
- `/provider`
- `/admin`

## Important
This is the complete frontend/demo layer. Authentication, database, real payments, maps, provider GPS tracking, chat, notifications and server-side role security should be connected to a backend API before production deployment.
