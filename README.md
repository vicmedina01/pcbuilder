# PC Builder

PC Builder is a fullstack ecommerce project for browsing PC components, building a custom PC setup, managing a cart, signing in with Google, and preparing an order checkout flow.

This project was built as a first fullstack portfolio project to practice how a modern Next.js app connects frontend UI, backend route handlers, authentication, database models, and payment preparation in one codebase.

## Live Demo

https://pcbuilder-olive.vercel.app

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- React Context API for cart state
- Next.js Route Handlers for backend endpoints
- NextAuth.js with Google OAuth
- Prisma ORM
- PostgreSQL hosted on Supabase
- Stripe checkout preparation
- Vercel deployment target

## Features

- Product catalog with component cards
- Product detail pages
- Cart state using React Context
- Add, remove, update quantity, and clear cart actions
- PC Builder page to select parts by category
- Basic build notes for missing parts and compatibility reminders
- Google sign-in with NextAuth
- Order history page for signed-in users
- Prisma ecommerce models for products, users, orders, and order items
- Backend routes for products, orders, and checkout
- Local fallback product data when the database is unavailable
- Stripe checkout route prepared for test/production credentials
- Checkout sessions include order metadata for future webhook handling
- Stripe webhook route can update orders to `PAID` or `CANCELLED`
- Production build verified with Next.js

## Project Structure

```text
app/
  api/
    auth/[...nextauth]/
    checkout/
    orders/
    products/
  builder/
  cart/
  products/
components/
context/
lib/
prisma/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run postinstall
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Environment Variables

Copy `.env.example` into `.env.local` and add the required values:

```bash
cp .env.example .env.local
```

For local development:

```env
DATABASE_URL="your_supabase_database_url"
DIRECT_URL="your_supabase_direct_database_url"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For Vercel production, set these in the Vercel dashboard:

```env
NEXTAUTH_URL="https://pcbuilder-olive.vercel.app"
NEXT_PUBLIC_APP_URL="https://pcbuilder-olive.vercel.app"
```

Stripe is optional while developing. If `STRIPE_SECRET_KEY` is missing, the checkout route returns a clear configuration message instead of crashing the app.

For Stripe webhooks, configure this endpoint in Stripe:

```text
https://pcbuilder-olive.vercel.app/api/stripe/webhook
```

Listen for:

- `checkout.session.completed`
- `checkout.session.expired`

## Deployment

The project is deployed on Vercel from the `main` branch. Production environment variables are configured in the Vercel dashboard, while local development uses `.env.local`.

For Google OAuth in production, the authorized redirect URI must include:

```text
https://pcbuilder-olive.vercel.app/api/auth/callback/google
```

## Database

The database is modeled with Prisma and PostgreSQL. The main models are:

- `Product`
- `User`
- `Order`
- `OrderItem`

Run migrations with:

```bash
npx prisma migrate dev
```

Seed product data with:

```bash
npm run db:seed
```

Generate Prisma client after schema changes:

```bash
npx prisma generate
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run db:seed
```

## Testing

Before deploying, run:

```bash
npm run lint
npm run build
```

For production checks, use the manual checklist in [`docs/manual-testing.md`](docs/manual-testing.md).

## Current Status

The project currently includes the main ecommerce flow, cart, basic PC builder, authentication setup, Prisma models, and backend routes. Stripe is prepared, but real payments require valid Stripe credentials.

## Future Improvements

- Add product management from the database instead of only local fallback data
- Add deeper PC part compatibility checks
- Add richer Stripe payment states and webhook event coverage
- Improve loading and error states
- Add tests for cart and API routes
