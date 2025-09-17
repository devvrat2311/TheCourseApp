# TheCourseApp - Project Overview

[Back to Main Page](../README.md)

## Project Structure

This is a full-stack web application built with a React frontend and Express.js Backend, using MongoDB as the database.

```
theCourseApp/
├─client/    # during development phase (react/vite)
│   ├─src/
│   │   ├─assets/
│   │   ├─components/
│   │   ├─pages/
│   │   ├─utils/
│   │   ├─App.css
│   │   ├─App.jsx
│   │   ├─index.css
│   │   └─main.jsx
│   ├─public/
│   │   └─vite.svg
│   ├─index.html
│   ├─vite.config.js    # vite configuration
│   ├─package.json
│   ├─package-lock.json
│   ├─eslint.config.js  # ESLint config  
│   └─README.md
├─config/
│   └─db.js
├─controllers/
│   ├─authController.js
│   ├─courseController.js
│   └─userController.js
├─docs/
│   └─overview.md
├─middleware/
│   └─auth.js
├─migrations/
│   └─migradeUserNewSchema.js
├─models/
│   ├─Auth.js
│   ├─Course.js
│   └─User.js
├─routes/
│   ├─authRoutes.js
│   ├─courseRoutes.js
│   └─userRoutes.js
├─app.js
├─seeder.js
├─package-lock.json
└─package.json
```

## Architecture Overview

### Frontend ("client/")
- **Technology Stack**: React.js with Vite build tool
- **Creation Method**: Bootstrapped with `npm create vite@latest client -- --template react`
- **Development**: Modern React with functional components and hooks
- **Styling**: CSS modules and styled components
- **Entry point**: main.jsx

### Backend ("Root Directory")
- **Technology Stack**: Node.js with Express.js framework and MongoDB via Mongoose
- **Creation Method**: Build from Scratch using vanilla approach:
    1. `npm init` to initialize the project
    2. `npm install express mongoose` and other dependencies as needed
    3. Manual creation on-the-go of MVC style directory structure.
- **Architecture Pattern**: Model-View-Controller (MVC) with RESTful API design

### Key Backend Components

**Models (`/models`)**
- Mongoose schema definitions for database entities
- Handles data structure and validation rules
- Defines relationships between entities

**Controllers (`/controllers`)**
- Business logic and request handling
- Processes HTTP requests and sends responses
- Orchestrates interaction between models and routes

**Routes (`/routes`)**
- API endpoint definitions
- HTTP method handlers (GET, POST, PUT, DELETE)
- Middleware integration for authentication and validation

**Middleware (`/middleware`)**
- Custom middleware functions for cross-cutting concerns
- Authentication and authorization logic
- Input validation and error handling

**Configuration (`/config`)**
- Database connection setup
- Authentication configuration (JWT settings, etc.)
- Environment-specific configurations

### Development Approach

This project demonstrates a **learn-by-building** approach:

1. **Backend**: Hand-crafted Express.js application following MVC principles
   - No generators or boilerplates used
   - Clean, purposeful directory structure
   - Custom middleware and configuration setup

2. **Frontend**: Modern React development with Vite
   - Fast development server and hot module replacement
   - Component-based architecture
   - Modern JavaScript/JSX syntax

### Database Strategy
- **Primary Database**: MongoDB with Mongoose ODM
- **Migration System**: Custom migration scripts in `/migrations`
- **Data Seeding**: Utility scripts for populating development data (`seeder.js`)

This structure represents a well-organized full-stack application that separates concerns effectively while maintaining clear relationships between different parts of the system.


[Back to Main Page](../README.md)
