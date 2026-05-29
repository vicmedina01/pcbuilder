# Manual Testing Checklist

Use this checklist after deploying a new version to Vercel.

## Public Pages

- Open the home page.
- Open the product catalog.
- Open a product detail page.
- Confirm product images, names, categories, and prices render correctly.
- Open the PC Builder page.

## Cart Flow

- Add a product from the catalog.
- Add a product from the product detail page.
- Add selected PC Builder parts to the cart.
- Update product quantity in the cart.
- Remove a product from the cart.
- Clear the cart.

## Authentication

- Sign in with Google.
- Confirm the navbar changes after sign-in.
- Sign out.
- Confirm protected/user-specific areas no longer show user data.

## Orders

- Sign in with Google.
- Add products to the cart.
- Start checkout so an order is created.
- Open the order history page.
- Confirm the order appears with total, status, and item details.

## Stripe

- Confirm checkout shows a clear message if Stripe is not configured.
- With Stripe test keys configured, confirm checkout redirects to Stripe.
- Complete a test checkout.
- Confirm the Stripe webhook updates the order status.
- Cancel or expire a checkout session and confirm the order can be marked cancelled.

## Deployment

- Confirm Vercel deployment succeeds.
- Confirm required Vercel environment variables are configured.
- Confirm Google OAuth production redirect URI is configured.
- Confirm the production URL loads without authentication errors.
