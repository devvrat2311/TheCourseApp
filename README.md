# theCourseApp - [thecourseapp.in](https://thecourseapp.in)

#### An e-learning platform, where students can learn and teachers can create. To connect those who love learning with those with a passion for teaching.

[devvrat2311/TheCourseApp](https://github.com/devvrat2311/TheCourseApp) **_(Github)_**
[thecourseapp.in](https://thecourseapp.in) **_(Live Demo)_**

## Tech Stack

**_Frontend_**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**_Backend_**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) ![Mailgun](https://img.shields.io/badge/Mailgun-F06B66?style=for-the-badge&logo=mailgun&logoColor=white)

**_DevOps_**
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) ![DigitalOcean](https://img.shields.io/badge/Digital_Ocean-0080FF?style=for-the-badge&logo=DigitalOcean&logoColor=white) ![Debian](https://img.shields.io/badge/Debian-A81D33?style=for-the-badge&logo=debian&logoColor=white)

### What is it?

A full stack e-learning platform where students can en-roll in courses, track progress throughout the text and quiz-based content, while instructors can manage course creation with a dedicated dashboard. Built this project to understand multi-role authentication and complex state management.

### Screenshots

#### Login Page

![Login Dark Mode](./assets/login_dark.png)

#### Student Account

![Student Course Section](./assets/course_section.png)

#### Instructor Account

![Instructor Edit Quiz Question](./assets/instructor_edit_quiz_question.png)

[More Screenshots](#more-screenshots)

## Features

### For Students

- Browse Course catalog and view course details
- Enroll in Courses and track completion progress
- Learn at your own pace by completing text-based lessons with quiz assessments
- Secure signup with email verification

### For Instructors

- Full CRUD operations for course management
- Create Modules with rich text content (formatted text, Code Snippets, Latex for Scientific Expressions, Images(url))
- Design quizzes with multiple choice questions to test understanding
- View Enrolled students per course

### System Features

- JWT-based authentication with access and refresh tokens
- Role based access control middleware
- Email verification and password reset workflows
- Responsive and clean UI design
- Dockerized deployment with Nginx proxy on DigitalOcean VPS

## Technical Decisions

### 1. Authentication Strategy

**Choice:** JWT with access & refresh token pattern

**Why:** Short-lived access tokens (15 min) authenticate API requests, while refresh tokens enable automatic token renewal without re-login. Provides stateless authentication with no server-side session storage needed, improving scalability.

### 2. Role Based Access Control

**Choice:** Token based and Middleware based RBAC with role checks at route level.

**Why:** Frontend uses React Router with role information from JWT to control UI route access. Backend implements verifyToken middleware to validate tokens, plus role-specific middleware (verifyStudent, verifyInstructor) to protect endpoints based on user roles. Centralizes authorization logic and prevents unauthorized access.

### 3. Database Security

**Choice:** MongoDB with authentication enabled, deployed as a docker container, no public ports exposed

**Why:** After a security incident where an exposed MongoDB port (no auth) led to a ransom attempt, implemented proper security measures: network isolation (only frontend container exposed to web), MongoDB authentication with credentials in .env (excluded from Git), and firewall rules. Database now only accessible from the application server container.

### 4. Email Service

**Choice:** Mailgun for transactional emails

**Why:** Reliable delivery for verification and password reset emails. DigitalOcean blocks SMTP ports (25, 587) on VPS instances to prevent spam, so direct SMTP via Nodemailer wasn't viable. Mailgun API provides guaranteed delivery without port restrictions.

### 5. Deployment Architecture

**Choice:** Docker + Nginx reverse proxy on DigitalOcean VPS

**Why:** Docker ensures consistent environments across dev/prod. Nginx handles SSL termination, static file serving, and request routing to backend container.

### 6. Frontend API Client with Auto Token Refresh

**Choice:** Centralized API client class handling all HTTP requests with automatic token refresh

**Why:** Eliminates code duplication across components - every API call automatically includes authorization headers and handles token expiration transparently. Implements request queuing during token refresh to prevent race conditions when multiple simultaneous requests encounter expired tokens. Centralizes error handling and retry logic in one place rather than scattered across dozens of components.

### 7. Course Data Structure

**Choice:** Nested schema with embedded modules and sections (Course -> Modules[ -> Sections[contentBlock/quizQuestion]])

**Why:** Initially chose embedded documents for simpler queries - fetching a course returns all related content in one query. Trade-off: Updates to individual sections require updating the entire course document, and payloads can be large for courses with many modules.

**Reflection:** In a larger-scale system, separating into referenced collections (Course → Module → Section) would enable more granular updates, leaner API responses, and better caching strategies. Good learning experience in understanding the embedded vs referenced documents trade-off in MongoDB.

### 8. Separation of User and Auth Models

**Choice:** Separate collections for User profile data and Auth/security data

**Why:** Keeps security-sensitive data (password hash, tokens, failed login attempts) isolated from general user profile information. Enables:

- Querying user profiles without loading security credentials
- Different access patterns - auth data accessed on login/token refresh, user data accessed frequently for UI
- Easier security auditing - all auth events in one collection
- Cleaner schema organization - User model focuses on profile/role data, Auth model handles authentication/security

**Trade-off:** Requires joining on userId for some operations, but the security and architectural benefits outweigh the minor query complexity.

## How to build and develop this application

### Prerequisites

- Node.js v24+
- NPM v11+
- Docker & Docker Compose (Recommended) v29+
- MongoDB (only if running without docker) v8+
- A Mailgun Account (For email functionality)
- A DigitalOcean Account (For Deployment, Optional)

### 1. Clone the Repository and navigate to it

```
git clone git@github.com:devvrat2311/TheCourseApp.git course_app_directory
cd course_app_directory
```

### 2. Local Development (Non Docker)

### a. Set up Node Modules for the application and the client

```
npm install
cd client/
npm install
```

### b. Set up the `.env` file

Inside the app directory, you will find the `.env.example.local` file which looks like this:

```
MONGO_URI=mongodb://YOUR_DB_USERNAME:YOUR_DB_PASSWORD@mongodb:27017/courses-platform?authSource=admin
FRONTEND_URL=http://localhost:5173
MAILGUN_API_KEY=your_mailgun_api_key
EMAIL_FROM=noreply@yourdomain.com
PORT=5000
JWT_SECRET=your_strong_jwt_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret
```

You have to set 6 variables here:

`MONGO_URI` along with `YOUR_DB_USERNAME` and`YOUR_DB_PASSWORD`

`MAILGUN_API_KEY` which you will obtain after creating a mailgun free tier account

`JWT_SECRET` and `JWT_REFRESH_SECRET`, set these as super strong secrets

### c. Spin up the servers

Spin up the Backend server with `nodemon app.js`

- Check the backend `nodemon app.js` console for a message like "connected to mongodb"

Spin up the frontend server with `cd client/` followed by `npm run dev`

- This will start the client side of you application on `localhost:5173`

Now you can access the frontend on your browser and start hacking away at the application!

### More Screenshots

#### Student Account

![Student Dashboard](./assets/student_dashboard.png)
![Student Enroll in Course](./assets/enroll_course.png)
![Student Course Page](./assets/course_page.png)
![Student Course Quiz](./assets/course_quiz.png)

#### Instructor Account

![Instructor Dashboard](./assets/instructor_dashboard.png)
![Instructor Course Page](./assets/instructor_course.png)
![Instructor Sections Page](./assets/instructor_sections.png)
![Instructor Edit Section Page](./assets/instructor_edit_section.png)
![Instructor Edit Quiz Page](./assets/instructor_edit_quiz.png)
![Instructor Create Content](./assets/instructor_create_content_block.png)
