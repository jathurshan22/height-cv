# Height CV deployment fix

## Frontend (Vercel)

Use the repository root as the Vercel Root Directory (the folder containing `package.json`, `src/`, and `index.html`).

Environment variables:

```env
VITE_API_URL=https://height-cv-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

Production + Preview should both be enabled. Redeploy after changing them.

The API client accepts both `https://height-cv-api.onrender.com` and `https://height-cv-api.onrender.com/api`; it normalizes the missing `/api` automatically.

`vercel.json` contains the SPA rewrite so direct navigation to `/login`, `/register`, `/dashboard`, etc. works.

## Backend (Render)

Root Directory: `backend`

Build Command: `npm install`

Start Command: `npm start`

Required environment variables:

```env
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

`CLIENT_URL` can contain multiple comma-separated frontend origins.

## Verification

1. Open `https://height-cv-api.onrender.com/api/health` and confirm `{"status":"ok"}`.
2. In the frontend browser Network tab, login must call `https://height-cv-api.onrender.com/api/auth/login`.
3. Templates must call `/api/templates/featured`.
4. Home stats must call `/api/home/stats`.
5. CV requests must call `/api/cvs`.
6. Google login must use a real Google OAuth **Web application** client ID and the exact Vercel origin must be authorized.
