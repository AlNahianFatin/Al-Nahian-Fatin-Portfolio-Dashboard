# Fatin Portfolio Dashboard

Private admin dashboard for the portfolio. It uses the same PostgreSQL database/schema as the portfolio project.

## Features
- JWT access + refresh authentication in HttpOnly cookies
- No refresh-token database table; refresh tokens are handled manually
- bcrypt password hashing
- Portfolio content CRUD
- Messages search/filter/read management
- Unread notification banner
- 7/15-day analytics
- Password change

## Setup
1. Copy `.env.example` to `.env`.
2. Use the SAME `DATABASE_URL` as the portfolio project.
3. Set strong JWT secrets.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.
5. `npm install`
6. `npm run db:generate`
7. `npm run db:push`
8. `npm run db:seed`
9. `npm run dev`

Dashboard: http://localhost:3001

Important: the `Admin` record is shared with this database, while the public portfolio never exposes admin routes.
