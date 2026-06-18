# Event Ticket Booking System (MERN Stack)

A full-stack event ticket booking system built as part of a hiring assignment. The system focuses on solving a real-world seat reservation problem with proper handling of concurrency, reservation expiry, and booking confirmation.

The goal of this project is not just CRUD operations, but demonstrating system design thinking around:
- preventing double booking
- handling temporary seat locks (reservations)
- ensuring consistency between reservation and final booking
- building a production-ready full-stack flow

---

## Live Links

- Frontend: https://ticket-booking-system-navy.vercel.app/
- Backend: https://ticket-booking-system-k122.onrender.com

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication (Access + Refresh Tokens)
- bcrypt (password hashing)
- cookie-based auth (HTTP-only refresh token)
- node-cron (automated cleanup job)

### Frontend
- React (Vite)
- React Router
- Axios (interceptors for auth handling)
- Tailwind CSS

---

## Core Features

### Authentication System
- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Role-based access control (Admin / User)
- HTTP-only refresh token stored in cookies

---

### Event Management (Admin)
- Create events (Admin only)
- Events contain:
  - name
  - venue
  - date & time
  - total seats
- Protected admin routes using middleware

---

### Seat Reservation System (Core Logic)

This is the most important part of the project.

#### Flow:
1. User selects seats from event seat grid
2. Backend validates seat availability
3. Selected seats are marked as `reserved`
4. A reservation document is created with:
   - userId
   - eventId
   - seatNumbers
   - expiresAt (10 minutes)

#### Expiry Handling:
- Reservations automatically expire after 10 minutes
- A cron job runs periodically to clean expired reservations
- Expired reservations release seats back to `available`

---

### Booking System

#### Flow:
1. User confirms reservation
2. Backend validates:
   - reservation exists
   - reservation is not expired
   - user owns the reservation
3. Seats are updated to `booked`
4. Reservation document is deleted

#### Key Constraint:
- Prevents double booking using atomic update logic and reservation locking strategy

---

## System Design Highlights

### 1. Double Booking Prevention Strategy
Instead of directly booking seats:
- Seats are first moved to `reserved`
- Only reserved seats can be converted to `booked`
- Ensures no two users can confirm the same seat simultaneously

---

### 2. Reservation Expiry Mechanism
- Each reservation has an `expiresAt` timestamp
- node-cron job runs in background:
  - finds expired reservations
  - releases associated seats
  - removes stale reservation entries

This prevents:
- stuck reserved seats
- ghost reservations blocking availability

---

### 3. Authentication Architecture
- Access token stored in localStorage
- Refresh token stored in HTTP-only cookie
- Middleware protects all sensitive routes
- Role-based middleware restricts admin operations

---

### 4. API Protection Strategy
- `authMiddleware` → verifies JWT and attaches user to request
- `adminMiddleware` → ensures only admins can create events
- Centralized error handling for consistency

---

### 5. Frontend Architecture
- Component-based structure
- Axios interceptor handles:
  - attaching auth token automatically
  - redirecting on 401
- Clean separation of:
  - pages
  - services
  - components
  - layouts
  - utils

---

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/refreshAccessToken`

### Events
- GET `/api/events`
- GET `/api/events/:id`
- POST `/api/events` (Admin only)

### Reservation
- POST `/api/reserve`

### Booking
- POST `/api/bookings`

---

## Environment Variables

### Backend `.env`

PORT=5000  
MONGO_URI=your_mongodb_atlas_url  

JWT_ACCESS_SECRET=your_access_secret  
JWT_REFRESH_SECRET=your_refresh_secret  

ACCESS_EXPIRY=15m  
REFRESH_EXPIRY=7d  

NODE_ENV=production  

FRONTEND_URL=https://ticket-booking-system-navy.vercel.app  

---

### Frontend `.env`

VITE_BASE_URL=https://ticket-booking-system-k122.onrender.com/api  

---

## How to Run Locally

### Backend

cd backend  
npm install  
npm run dev  

### Frontend

cd frontend  
npm install  
npm run dev  

---

## Folder Structure

backend/  
  controllers/  
  models/  
  routes/  
  services/  
  middlewares/  
  jobs/  
  config/  

frontend/  
  pages/  
  components/  
  services/  
  layouts/  
  utils/  

---

## Key Engineering Decisions

### Why reservation system instead of direct booking?
Direct booking creates race conditions when multiple users select the same seat at the same time.  
To solve this, a reservation layer is introduced.

---

### Why cron job for cleanup?
Because relying only on frontend timers is unreliable.  
Server-side cleanup ensures data consistency even if user leaves or closes browser.

---

### Why JWT + refresh token?
To balance security and usability:
- Access token → short-lived, used for API calls
- Refresh token → long-lived, stored securely in HTTP-only cookie

---

### Why role-based middleware?
To separate responsibilities:
- users → booking flow
- admin → event creation & management

---

## Future Improvements

- Real-time seat updates using WebSockets (Socket.io)
- Payment gateway integration (Stripe/Razorpay)
- Email confirmation after booking
- Seat-level live locking UI (real-time countdown sync)
- Admin analytics dashboard
- Pagination + filtering for events
- Mobile app using React Native
- Redis-based distributed locking for scaling

---

## Summary

This project demonstrates a complete real-world booking system with:
- secure authentication
- role-based access
- concurrency-safe seat reservation system
- time-based expiry handling
- production-ready deployment setup

It focuses on system design and backend correctness more than UI complexity, making it suitable for production-style evaluation.
