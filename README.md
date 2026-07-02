# Leave Management System

A full-stack leave management platform built with React, Node.js, Express, and MongoDB. Employees can register, log in, apply for leave, track leave balance, and review leave history. Admin users can review requests, approve or reject them, and monitor leave statistics.

## Features

- User registration and login with JWT authentication
- Protected employee dashboard with leave balance and leave status charts
- Leave application flow with leave type, date range, and reason
- Leave history with search and status filtering
- Export leave history to Excel and PDF
- Admin dashboard with leave analytics
- Admin panel for approving or rejecting leave requests

## Tech Stack

- Frontend: React, React Router, Chart.js, React Chart.js 2
- Backend: Node.js, Express, MongoDB, Mongoose
- Utilities: JWT, bcryptjs, ExcelJS, PDFKit, CORS, dotenv

## Project Structure

```text
leave-management-system/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    └── build/
```

## Prerequisites

- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd leave-management-system
```

### 2. Configure the backend environment

Create a file named `.env` inside `backend/` with your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
```

### 3. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Run the App

Start the backend server from the `backend/` folder:

```bash
npm start
```

The API runs on `http://localhost:5000`.

Start the frontend app from the `frontend/` folder:

```bash
npm start
```

The React app runs on `http://localhost:3000`.

## Available Scripts

### Frontend

From `frontend/`:

- `npm start` - starts the development server
- `npm test` - runs the test suite
- `npm run build` - creates a production build
- `npm run eject` - ejects from Create React App

### Backend

From `backend/`:

- `npm start` - starts the API server with nodemon

## Main User Flows

- Register a new account and log in as a user
- View the dashboard for leave balance and status breakdown
- Apply for leave by selecting dates, leave type, and reason
- Review leave history and export records as Excel or PDF
- Log in as an admin to see all requests, statistics, and approval controls

## API Overview

Base URL: `http://localhost:5000`

### Auth

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - log in and receive a JWT token

### Leave

- `POST /api/leave/apply` - submit a leave request
- `GET /api/leave/history` - get the current user's leave history
- `GET /api/leave/balance` - get the current user's remaining leave balance
- `GET /api/leave/export/excel` - export leave history as Excel
- `GET /api/leave/export/pdf` - export leave history as PDF
- `GET /api/leave/user/stats` - get current user leave stats

### Admin

- `GET /api/leave/all` - list all leave requests
- `PUT /api/leave/status/:id` - approve or reject a leave request
- `GET /api/leave/admin/stats` - get admin leave statistics

## Notes

- The app uses token-based authentication and stores the token in `localStorage`.
- Admin access is restricted through protected routes and backend middleware.
- User leave balance is initialized with 12 casual leaves by default.

## Future Improvements

- Replace the hardcoded JWT secret with an environment variable
- Add validation and better error handling for edge cases
- Add automated tests for backend routes and frontend flows
- Add role management UI for promoting users to admin

## Author

Nikhil Akkenapally
