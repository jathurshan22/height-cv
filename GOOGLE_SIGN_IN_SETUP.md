# Height CV — Google Sign-In Setup

Google Sign-In is wired through Google Identity Services and the existing Height CV JWT session.

## 1. Create a Google OAuth client

In Google Cloud Console, create an OAuth 2.0 Client ID with application type **Web application**.

Add your frontend origins under **Authorized JavaScript origins**:

- `http://localhost:5173`
- Your production HTTPS origin when deployed

## 2. Configure the frontend

Create `.env` (the `.env` file beside the frontend `package.json`) and set:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

## 3. Configure the backend

In `backend/.env` set the **same** client ID:

```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

Do not expose a Google client secret in the frontend. This implementation does not require one.

## 4. Start the app

Restart both servers after changing environment variables:

```bash
# terminal 1
cd backend
npm install
npm start

# terminal 2
npm install
npm run dev
```

## How it works

1. Google Identity Services displays the official Google account selector.
2. Google returns a signed ID-token credential to the React app.
3. React sends that credential to `POST /api/auth/google`.
4. The backend validates the credential with Google's token validation endpoint and checks the client ID/audience and verified email.
5. Height CV creates a new user or links Google to an existing account with the same email.
6. Height CV returns its normal JWT, so all existing protected pages and API calls work exactly like email/password login.

## Vercel production checklist

For a Vercel deployment, add these environment variables to **Production and Preview**:

```env
VITE_API_URL=https://height-cv-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

The frontend API client also normalizes the URL, so `https://height-cv-api.onrender.com` is accepted and automatically gets `/api`.

After changing Vercel environment variables, redeploy the latest deployment because Vite injects `VITE_*` values at build time.

For Render, configure the backend service with root directory `backend`, build command `npm install`, and start command `npm start`. Set:

```env
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

`GOOGLE_CLIENT_ID` must be the same Web Client ID used by `VITE_GOOGLE_CLIENT_ID`. In Google Cloud Console, add the exact Vercel HTTPS origin under **Authorized JavaScript origins**.
