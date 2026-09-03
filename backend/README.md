# Height CV Backend

Node.js + Express + MongoDB Atlas backend for the Height CV frontend.

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure MongoDB Atlas

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Do not commit `.env`.

## 3. Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check: `GET http://localhost:5000/api/health`

## API

### Auth
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` with `Authorization: Bearer <token>`
- `POST /api/auth/google` verifies Google Identity Services ID tokens and creates/links a local account

### CVs (JWT required)
- `GET /api/cvs`
- `GET /api/cvs/:id`
- `POST /api/cvs`
- `PUT /api/cvs/:id`
- `DELETE /api/cvs/:id`

### Analysis (JWT required)
- `POST /api/ats/analyze`
- `POST /api/ai/improve`
- `POST /api/jobs/match`

The CV schema intentionally mirrors the current frontend `CVData` structure so the frontend can be connected without redesigning the UI.


## Google Sign-In

1. Create a Google OAuth 2.0 **Web application** client in Google Cloud Console.
2. Add `http://localhost:5173` to **Authorized JavaScript origins** (and your production origin when deployed).
3. Put the same client ID in both frontend `VITE_GOOGLE_CLIENT_ID` and backend `GOOGLE_CLIENT_ID`.
4. Restart both Vite and the Express server after changing `.env` files.

Google Sign-In uses Google Identity Services in the browser and the backend validates the returned ID token before issuing the app's normal JWT session.
