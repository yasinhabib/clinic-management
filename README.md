# Clinic Management System

A full-stack application for managing clinic operations, built with NestJS backend and React frontend.

## Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clinic-management
   ```

2. Install dependencies for all parts of the application:
   ```bash
   npm run install:all
   ```
   This command will install dependencies for the root, frontend, and backend.

## Running the Application

### Development Mode

To run both backend and frontend in development mode concurrently:
```bash
npm run dev
```

This will start:
- Backend server on port 3000 (NestJS with GraphQL)
- Frontend development server on port 5173 (Vite)

### Running Individually

- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```

- **Backend only:**
  ```bash
  npm run dev:backend
  ```

## Building the Application

To build both frontend and backend for production:
```bash
npm run build
```

This will:
- Build the frontend (React app) into `frontend/dist`
- Build the backend (NestJS) into `backend/dist`

### Building Individually

- **Build frontend:**
  ```bash
  npm run build:frontend
  ```

- **Build backend:**
  ```bash
  npm run build:backend
  ```

## Starting Production Build

After building, start the production server:
```bash
npm run start
```

This will start the backend in production mode.

## Features

### User Management
- User registration and authentication
- Role-based access control
- JWT-based authentication

### Patient Management
- Create, view, edit, and delete patient records
- Patient information management

### Appointment Management
- Schedule and manage appointments
- Appointment workflow integration

### Examination Management
- Record and manage patient examinations
- Examination workflow

### Medicine Management
- Inventory management for medicines
- Medicine prescription tracking

### Payment Management
- Handle billing and payments
- Payment records and tracking

### Workflow Management
- Customizable workflows for clinic processes
- Drag-and-drop workflow builder
- Integration with appointments, examinations, and payments

### Additional Features
- GraphQL API for efficient data fetching
- SQLite database for data persistence
- Responsive UI with TailwindCSS
- Real-time updates with Apollo Client

## Technology Stack

### Backend
- **Framework:** NestJS
- **API:** GraphQL with Apollo Server
- **Database:** SQLite with TypeORM
- **Authentication:** JWT with Passport
- **Validation:** class-validator

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** Apollo Client for GraphQL
- **Routing:** React Router
- **Drag & Drop:** @dnd-kit

### Development Tools
- **Linting:** ESLint
- **Formatting:** Prettier
- **Testing:** Jest
- **TypeScript:** Full TypeScript support

## Project Structure

```
clinic-management/
├── backend/          # NestJS backend application
├── frontend/         # React frontend application
├── package.json      # Root package.json with scripts
└── README.md         # This file