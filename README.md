# 🛒 Vendora — Multi-Vendor Local Marketplace

A full-stack web application that connects local retailers with customers in their area. Vendors can list products, manage inventory, and receive orders for pickup or delivery.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer |
| HTTP Client | Axios |

## Features

### Customer
- Browse products by category or search
- View vendor stores and their details
- Add items to cart (single-vendor cart)
- Checkout with pickup or delivery option
- Track orders with live status updates
- Leave product reviews and ratings
- Manage profile

### Vendor
- Register a store with delivery/pickup options
- Dashboard with product management (add, toggle, delete)
- View and update incoming orders
- Revenue and order stats

### Admin
- Approve vendors
- Manage product categories

## Project Structure

```
vendora/
├── backend/
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth & upload middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── uploads/           # Uploaded product images
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
└── frontend/
    ├── src/
    │   ├── api/           # Axios client
    │   ├── components/    # Shared UI components
    │   ├── context/       # Auth & Cart context
    │   └── pages/         # All page components
    └── .env               # Frontend env vars
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vendora
JWT_SECRET=vendora_jwt_super_secret_key_2026
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Categories (one-time)

After starting the backend, create an admin user and use the category API to seed:

```bash
# Register admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@vendora.com","password":"admin123","role":"admin"}'
```

Then use the token to create categories via `POST /api/categories`.

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | - |
| POST | /api/auth/login | Login | - |
| GET | /api/auth/profile | Get profile | ✓ |
| GET | /api/vendors | List approved vendors | - |
| POST | /api/vendors/register | Register vendor | ✓ |
| GET | /api/vendors/me | My vendor profile | ✓ |
| GET | /api/products | List products | - |
| POST | /api/products | Create product | Vendor |
| GET | /api/products/mine | My products | Vendor |
| POST | /api/orders | Place order | ✓ |
| GET | /api/orders/my | My orders | ✓ |
| GET | /api/orders/vendor | Vendor orders | Vendor |
| PUT | /api/orders/:id/status | Update order status | Vendor |
| GET | /api/categories | List categories | - |
| POST | /api/categories | Create category | Admin |

## User Roles

- **customer** — browse, cart, checkout, orders
- **vendor** — all customer features + dashboard, product management
- **admin** — approve vendors, manage categories
