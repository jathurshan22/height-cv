# Height AI — Full CV & Career Platform

## Run locally

### Frontend
```bash
npm install
npm run dev
```
Open http://localhost:5173

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000

### MongoDB
Use local MongoDB or MongoDB Atlas. Put the connection string in `backend/.env`.

### Admin
Set `ADMIN_EMAIL` in `backend/.env`. Register using that email. The account is created with the `admin` role. Admin panel: `/admin`.

## Main features
- JWT authentication with expiry handling and blocked-user protection
- User/Admin role-based access control
- CV CRUD, autosave, draft/published status
- A4 browser PDF/print export
- Profile, password, avatar and preferences persistence
- Light/Dark/System themes
- Admin users, CVs, templates, audit logs and system settings
- AI usage logging with optional OpenAI integration and local fallback
- ATS analysis and job matching persistence
- Rate limiting, validation and security headers

Production deployment still requires your own MongoDB Atlas, AI/OAuth credentials and hosting/domain accounts.
