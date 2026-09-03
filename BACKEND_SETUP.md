# Height CV Backend Setup

The `backend/` folder is ready for MongoDB Atlas.

1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Paste your MongoDB Atlas connection string into `MONGODB_URI`.
5. Set a private `JWT_SECRET`.
6. Run `npm run dev`.
7. Confirm `http://localhost:5000/api/health` returns `{ "status": "ok" }`.

The existing frontend services can then be switched from mock data to these REST endpoints.
