# Subscription Tracker API

A robust RESTful API for managing subscription services, built with Node.js and Express. This application helps users track their subscriptions, receive renewal reminders, and manage the full subscription lifecycle.

## Features

- 🔐 User authentication & authorization (JWT)
- 📊 Subscription CRUD operations
- 📅 Automated renewal reminders via email
- 🛡️ Rate limiting & bot protection (Arcjet)
- 📧 Email notifications for renewals
- 🔄 Scheduled tasks with Upstash Workflow

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **Email:** Nodemailer (Gmail)
- **Security:** Arcjet, bcryptjs
- **Task Scheduling:** Upstash Workflow
- **Development:** ESLint, Nodemon

## API Endpoints

### Authentication

- `POST /api/v1/auth/sign-up` — Register a new user
- `POST /api/v1/auth/sign-in` — User login
- `POST /api/v1/auth/sign-out` — User logout (requires authentication)

### Users

- `GET /api/v1/users` — Get all users
- `GET /api/v1/users/:id` — Get a specific user
- `PATCH /api/v1/users/:id/deactivate` — Deactivate a user account

### Subscriptions

- `GET /api/v1/subscriptions` — Get all subscriptions
- `GET /api/v1/subscriptions/user/:id` — Get subscriptions for a user
- `POST /api/v1/subscriptions` — Create a new subscription
- `PUT /api/v1/subscriptions/:id` — Update a subscription
- `DELETE /api/v1/subscriptions/:id` — Delete a subscription
- `PUT /api/v1/subscriptions/user/:id/cancel` — Cancel all subscriptions for a user
- `GET /api/v1/subscriptions/upcoming-renewal` — Get upcoming renewals

## Data Models

### User

- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `isActive`: Boolean
- `deactivatedAt`: Date

### Subscription

- `name`: String
- `price`: Number
- `currency`: Enum (NAIRA, USD, EUR, GBP)
- `category`: Enum (sports, business, finance, political, others)
- `paymentMethod`: String
- `status`: Enum (active, inactive, expired)
- `startDate`: Date
- `renewDate`: Date
- `frequency`: Enum (daily, weekly, monthly, yearly)
- `user`: Reference to User

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting & bot detection (Arcjet)
- Input validation & sanitization
- Centralized error handling

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/waswayne/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create `.env.development.local` and/or `.env.production.local` with the following:

```env
PORT=3000
DB_URI=mongodb://your-mongodb-uri
NODE_ENV=development
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
ARCJET_ENV=development
ARCJET_KEY=your-arcjet-key
QSTASH_TOKEN=your-qstash-token
QSTASH_URL=your-qstash-url
SERVER_URL=http://localhost:3000
EMAIL_PASSWORD=your-email-password
```

### 4. Start the server

For development:

```sh
npm run dev
```

For production:

```sh
npm start
```

## Project Structure

```
subscription-tracker/
├── config/                 # Configuration files
│   ├── env.js
│   ├── mongodb.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/            # Route controllers
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── models/                 # MongoDB models
│   ├── user.model.js
│   └── subscription.model.js
├── routes/                 # Express routes
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   └── user.routes.js
├── middlewares/            # Custom middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── arcjet.middleware.js
├── utils/                  # Utility functions
│   ├── email-template.js
│   └── send-email.js
└── app.js                  # Main application file
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

For more details, see the code and comments in each file.
# subscription-tracker
