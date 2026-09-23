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
- **Live sync**: every content save/update/delete notifies the public
  portfolio so it updates immediately (see below)

## Setup
1. Copy `.env.example` to `.env`.
2. Use the SAME `DATABASE_URL` as the portfolio project.
3. Set strong JWT secrets.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.
5. Set `PORTFOLIO_URL` and `REVALIDATE_SECRET` (see "Live sync" below).
6. `npm install`
7. `npm run db:generate`
8. `npm run db:push`
9. `npm run db:seed`
10. `npm run dev`

Dashboard: http://localhost:3001

Important: the `Admin` record is shared with this database, while the public portfolio never exposes admin routes.

## Live sync with the portfolio

The portfolio's homepage is cached for performance, so without this, an edit
made here could take up to an hour to appear live (its cache's natural
expiry). This project closes that gap: after every successful create,
update, or delete on `/api/content/[model]` (profile, education, skills,
projects, experience, publications, social links, resume, or settings), the
dashboard calls the portfolio's `/api/revalidate` endpoint, which clears its
cache instantly.

To enable it, set on **this** project:
```
PORTFOLIO_URL=https://your-portfolio.example.com
REVALIDATE_SECRET=<same long random string as the portfolio project>
```

The call is fire-and-forget — implemented in `lib/revalidatePortfolio.ts` —
so if the portfolio is temporarily unreachable or the env vars aren't set,
the dashboard logs a warning to the console but the admin's save still
succeeds normally. Password changes and message read/unread state don't
trigger this, since they don't affect what the public page renders.


## Live message state sync

The dashboard's `MessageProvider` refreshes the unread count every two seconds,
and the messages page refreshes the message list on the same interval. This
means a contact-form submission on the public portfolio is reflected
automatically in the navbar notification, unread count, and messages page.

Marking one message as read, marking all as read, or deleting a message
updates the shared database and reconciles all dashboard message states.

The dashboard also exposes a protected `/api/revalidate` endpoint. The
portfolio calls it after creating a message when `DASHBOARD_URL` and the shared
`REVALIDATE_SECRET` are configured.
