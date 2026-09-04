#  Height CV

> **AI-Powered CV Builder & Career Assistant**
> Create professional CVs, analyze them for ATS compatibility, improve content with AI, and match your CV with job opportunities — all from one modern web application.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-3ECF8E?logo=supabase\&logoColor=white)](https://supabase.com/)

---

## About The Project

**Height CV** is a full-stack AI-powered CV and career assistance platform designed to help students, graduates, and professionals build stronger job applications.

The platform combines a modern CV builder with AI-powered career tools, allowing users to:

*  Build professional CVs
*  Choose and customize CV templates
*  Improve CV content using AI
*  Analyze CVs for ATS compatibility
*  Match CVs with job opportunities
*  Securely authenticate with email/password or Google
*  Save and manage CVs online
*  Manage personal profile and settings
*  Get help through the support system
*  Access an administrative dashboard

The application is built using a **React + TypeScript frontend** and a **Node.js + Express + MongoDB backend**.

---

#  Key Features

##  CV Builder

Create and edit professional CVs through an intuitive interface.

### Features

* Personal information
* Professional summary
* Education
* Work experience
* Skills
* Projects
* Certifications
* Additional CV sections
* Live CV preview
* Template-based CV design
* Save and update CVs
* Manage multiple CVs

---

##  Professional Templates

Choose from different CV designs and preview your CV before finalizing it.

The template system is designed to make adding new CV designs easier in the future.

---

##  AI-Powered CV Improvement

Height CV includes AI-assisted content improvement functionality.

Users can improve sections of their CV such as:

* Professional summaries
* Work experience descriptions
* Project descriptions
* Skills descriptions
* Other professional content

The goal is to make CV content:

* More professional
* Clearer
* More concise
* More impactful
* More suitable for recruiters

---

##  ATS Analyzer

The built-in ATS analyzer evaluates a CV and provides insights to improve its compatibility with Applicant Tracking Systems.

### Analysis can help identify:

* Missing keywords
* Weak sections
* Content issues
* Formatting concerns
* Overall ATS score
* Improvement opportunities

---

##  Job Matching

The Job Match feature helps users understand how well their CV aligns with a job opportunity.

It can provide insights into:

* Matching skills
* Missing skills
* Relevant keywords
* Job compatibility
* Areas that could be improved

---

##  Authentication

Height CV supports secure user authentication.

### Supported authentication

* Email & password registration
* Email & password login
* JWT-based sessions
* Google Sign-In
* Protected routes
* User-specific CV management

Google authentication uses **Google Identity Services**, while the backend validates the Google ID token before creating the application's JWT session.

---

##  User Dashboard

Authenticated users can access a personalized dashboard containing:

* CV overview
* Saved CVs
* CV creation
* CV analysis
* Job matching
* Profile settings
* Help & support

---

##  Admin Dashboard

The application includes an administrative dashboard for managing platform data and users.

Admin functionality includes areas for:

* User management
* CV/template management
* System information
* Support management
* Application statistics
* Audit information

---

##  Help & Support

Users can submit support requests through the integrated support system.

The backend includes support ticket functionality for managing user issues and requests.

---

#  System Architecture

```text
                    ┌───────────────────────┐
                    │      User / Admin     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React Frontend      │
                    │   TypeScript + Vite   │
                    │   Tailwind CSS        │
                    └───────────┬───────────┘
                                │
                         REST API Requests
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Express Backend     │
                    │      Node.js          │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
       Authentication       CV Services       AI / ATS
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    MongoDB Atlas      │
                    │       Database        │
                    └───────────────────────┘
```

---

#  Technology Stack

## Frontend

| Technology    | Purpose                  |
| ------------- | ------------------------ |
| React         | User interface           |
| TypeScript    | Type-safe development    |
| Vite          | Development & build tool |
| Tailwind CSS  | Styling                  |
| React Router  | Application routing      |
| Framer Motion | Animations               |
| Lucide React  | Icons                    |

## Backend

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Runtime                   |
| Express.js | REST API                  |
| MongoDB    | Database                  |
| Mongoose   | MongoDB ODM               |
| JWT        | Authentication            |
| bcryptjs   | Password hashing          |
| CORS       | Cross-origin requests     |
| dotenv     | Environment configuration |

## Integrations

* Google Identity Services
* Supabase
* AI services
* MongoDB Atlas

---

#  Project Structure

```text
height-cv/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── analysisController.js
│   │   ├── authController.js
│   │   ├── cvController.js
│   │   ├── homeController.js
│   │   ├── supportController.js
│   │   ├── templatesController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── security.js
│   │
│   ├── models/
│   │   ├── AIUsage.js
│   │   ├── ATSAnalysis.js
│   │   ├── AuditLog.js
│   │   ├── CV.js
│   │   ├── FaqItem.js
│   │   ├── JobMatch.js
│   │   ├── SupportTicket.js
│   │   ├── SystemSettings.js
│   │   ├── Template.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── analysisRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cvRoutes.js
│   │   ├── homeRoutes.js
│   │   ├── supportRoutes.js
│   │   ├── templatesRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   └── analysisService.js
│   │
│   ├── utils/
│   │   ├── cvMapper.js
│   │   └── token.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── public/
│   └── height-cv-logo.png
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AIButton.tsx
│   │   ├── CVPreview.tsx
│   │   ├── CVSection.tsx
│   │   ├── Footer.tsx
│   │   ├── GoogleSignInButton.tsx
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/
│   │   └── useTemplates.ts
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── ATSAnalyzer.tsx
│   │   ├── CreateCV.tsx
│   │   ├── CVBuilder.tsx
│   │   ├── Dashboard.tsx
│   │   ├── HelpSupport.tsx
│   │   ├── Home.tsx
│   │   ├── JobMatch.tsx
│   │   ├── Login.tsx
│   │   ├── MyCVs.tsx
│   │   ├── Register.tsx
│   │   ├── Settings.tsx
│   │   └── Templates.tsx
│   │
│   ├── services/
│   │   ├── adminService.ts
│   │   ├── aiService.ts
│   │   ├── api.ts
│   │   ├── atsService.ts
│   │   ├── authService.ts
│   │   ├── cvService.ts
│   │   ├── googleAuth.ts
│   │   ├── jobMatchService.ts
│   │   ├── supportService.ts
│   │   └── userService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── render.yaml
├── vercel.json
├── package.json
└── README.md
```

---

#  Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/height-cv.git

cd height-cv
```

---

#  Frontend Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

For macOS/Linux:

```bash
cp .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

#  Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
copy .env.example .env
```

Configure your backend environment:

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_long_random_secret

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
```

Start the backend:

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Backend API:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

#  Google Sign-In Setup

To enable Google authentication:

1. Create a project in Google Cloud Console.
2. Create an OAuth 2.0 Web Client.
3. Add your local frontend URL to **Authorized JavaScript origins**.

Example:

```text
http://localhost:5173
```

4. Add your production frontend URL after deployment.
5. Add the client ID to the frontend:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id
```

6. Add the same client ID to the backend:

```env
GOOGLE_CLIENT_ID=your_client_id
```

Restart both frontend and backend after modifying environment variables.

---

#  MongoDB Setup

Height CV uses **MongoDB Atlas** for persistent data storage.

Create a MongoDB Atlas cluster and obtain your connection string.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heightcv
```

Make sure your deployment environment is allowed to connect to the MongoDB cluster.

---

#  API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/google
```

---

## CV Management

JWT authentication required.

```http
GET    /api/cvs
GET    /api/cvs/:id
POST   /api/cvs
PUT    /api/cvs/:id
DELETE /api/cvs/:id
```

---

## AI & Analysis

```http
POST /api/ats/analyze
POST /api/ai/improve
POST /api/jobs/match
```

---

#  Security

The project includes multiple security mechanisms, including:

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Authentication middleware
* Security middleware
* CORS configuration
* Environment-based secrets
* Google token validation
* User-specific CV access
* Audit logging support

> **Never commit `.env` files, API keys, JWT secrets, database credentials, or OAuth secrets to GitHub.**

---

#  Deployment

Height CV is designed to support a separated frontend/backend deployment architecture.

### Frontend

Recommended deployment:

**Vercel**

### Backend

Recommended deployment:

**Render**

### Database

**MongoDB Atlas**

Architecture:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │     Vercel      │
              │ React Frontend  │
              └────────┬────────┘
                       │
                       │ HTTPS API
                       ▼
              ┌─────────────────┐
              │     Render      │
              │ Express Server  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MongoDB Atlas   │
              └─────────────────┘
```

---

#  Production Environment

For production, update the frontend environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

And configure the backend:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Also add your production frontend URL to the Google OAuth configuration.

---

#  Available Scripts

## Frontend

```bash
npm run dev
```

Start Vite development server.

```bash
npm run build
```

Create production build.

```bash
npm run preview
```

Preview production build locally.

```bash
npm run lint
```

Run ESLint.

```bash
npm run typecheck
```

Run TypeScript type checking.

---

## Backend

```bash
npm run dev
```

Start backend using Nodemon.

```bash
npm start
```

Start backend in production mode.

---

#  Responsive Design

Height CV is designed to work across:

*  Desktop
*  Laptop
*  Mobile
*  Tablet

The UI adapts to different screen sizes while maintaining the CV editing and preview experience.

---

#  Project Goals

The main goals of Height CV are to:

* Simplify professional CV creation
* Help users create recruiter-friendly CVs
* Improve ATS compatibility
* Provide AI-powered writing assistance
* Help users understand job compatibility
* Provide a centralized career preparation platform
* Deliver a modern and accessible user experience

---

#  Future Improvements

Potential future improvements include:

*  PDF CV export
*  DOCX export
*  Public CV sharing links
*  Advanced career analytics
*  More advanced AI recommendations
*  Improved job recommendation engine
*  Advanced admin analytics
*  Notifications
*  Premium subscription system
*  More professional CV templates
*  Multi-language CV support

---

#  Development

Before submitting changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For backend:

```bash
npm start
```

Verify the health endpoint:

```text
/api/health
```

---

#  Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Commit your changes

```bash
git commit -m "Add your feature"
```

### 4. Push the branch

```bash
git push origin feature/your-feature
```

### 5. Create a Pull Request

Please ensure that the application builds successfully and passes lint/type checks before submitting a pull request.

---

#  License

This project is currently intended for educational and portfolio purposes.

If you plan to distribute or commercialize the project, add an appropriate open-source or proprietary license here.

---

#  Author

**Yogeswaren Jathurshan**

Software Engineering Student | Full Stack Developer | UI/UX Designer | AI & ML Enthusiast

Built with  using React, TypeScript, Node.js, Express, MongoDB and AI technologies.

---

##  Support

If you find this project useful, consider giving the repository a  on GitHub.

**Height CV — Build a better CV. Build a better career.**
