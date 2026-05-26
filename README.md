# PC Builder

PC Builder is a fullstack ecommerce project for browsing PC components, building a custom PC setup, managing a cart, signing in with Google, and preparing an order checkout flow.

This project was built as a first fullstack portfolio project to practice how a modern Next.js app connects frontend UI, backend route handlers, authentication, database models, and payment preparation in one codebase.

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
- Google sign-in with NextAuth
- Prisma ecommerce models for products, users, orders, and order items
- Backend routes for products, orders, and checkout
- Stripe checkout route prepared for test/production credentials
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

Create a `.env.local` file in the project root and add the required values:

```env
DATABASE_URL="your_supabase_database_url"
DIRECT_URL="your_supabase_direct_database_url"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Stripe is optional while developing. If `STRIPE_SECRET_KEY` is missing, the checkout route returns a clear configuration message instead of crashing the app.

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
```

## Current Status

The project currently includes the main ecommerce flow, cart, basic PC builder, authentication setup, Prisma models, and backend routes. Stripe is prepared, but real payments require valid Stripe credentials.

## Future Improvements

- Add product management from the database instead of only local fallback data
- Add seed data for development
- Improve PC part compatibility checks
- Add user order history page
- Add Stripe webhook handling
- Improve loading and error states
- Add tests for cart and API routes
