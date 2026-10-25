# HabitFlow – Habit Tracker

HabitFlow is a full-stack web application that helps users build consistent daily routines, track their habits, and monitor their progress through completion statistics and streaks.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Create, edit, and delete habits
- Mark habits as completed for the day
- Track daily completion statistics and streaks
- Store user and habit data in MongoDB
- Responsive user interface

## Technologies Used

**Frontend:** React, Vite, JavaScript, CSS

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas, Mongoose

**Authentication:** JSON Web Token (JWT), bcrypt

## Project Structure

```text
habit-tracker/
├── client/        # React frontend
├── server/        # Express backend
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- A MongoDB Atlas account or another MongoDB database
- Git (optional, for cloning the repository)

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/24PA1A05A0-JONNADAPREMKUMAR/habit-tracker.git
cd habit-tracker
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder:

```dotenv
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS_LONG
NODE_ENV=development
```

Replace the example values with your own private configuration. Never upload `.env` or share your database credentials publicly.

### 4. Start the backend

From the `server` folder, run:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 5. Install frontend dependencies

Open a second terminal in the project root and run:

```bash
cd client
npm install
```

### 6. Start the frontend

From the `client` folder, run:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/habits` | Get the user's habits |
| GET | `/api/habits/stats` | Get habit statistics |
| POST | `/api/habits` | Create a habit |
| PUT | `/api/habits/:id` | Update a habit |
| PATCH | `/api/habits/:id/toggle` | Toggle today's completion |
| DELETE | `/api/habits/:id` | Delete a habit |

Habit endpoints require a valid JWT access token.

## Security

- Passwords are hashed before storage.
- Protected API routes require authentication.
- Users can access and modify only their own habits.
- Environment variables and credentials must remain private.

## Deployment

## Deployment

**Live Website:** https://habit-tracker-1tt5.onrender.com/

**GitHub Repository:** https://github.com/24PA1A05A0-JONNADAPREMKUMAR/habit-tracker

**Hosting:** Render  
**Database:** MongoDB Atlas

The application is deployed on Render, with MongoDB Atlas for persistent data storage. Environment variables are configured securely in the hosting platform.

## Author

Developed as an individual mini project for the FSD-II lab.
