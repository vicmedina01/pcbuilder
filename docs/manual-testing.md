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
- Reload the page and confirm cart contents persist.

## Compatibility

- Select a CPU and confirm motherboards with a different socket are disabled.
- Select DDR4 RAM and confirm DDR5-only motherboards are incompatible.
- Select a high-end GPU and confirm an undersized PSU produces an error.
- Confirm GPU, cooler, and radiator clearance messages use structured specifications.

## Saved Builds

- Sign in and save a partial or complete compatible build.
- Open the saved builds page.
- Toggle the build between private and public.
- Copy the public URL and open it while signed out.
- Confirm a private build cannot be viewed while signed out.
- Delete the saved build.

## Authentication

- Sign in with Google.
- Confirm the navbar changes after sign-in.
- Sign out.
- Confirm protected/user-specific areas no longer show user data.

## Administration

- Add the signed-in email to `ADMIN_EMAILS`.
- Sign out and sign in again.
- Confirm the Admin navigation item appears.
- Create a temporary product with a local image path.
- Edit its price, stock, technical specifications, and featured status.
- Confirm the storefront reflects the changes.
- Delete the temporary product.
- Sign in with a non-admin account and confirm `/admin` redirects away.
- Confirm direct requests to `/api/admin/products` return `403` for non-admin users.

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
- Confirm product stock is decremented once after payment.
- Resend the completed webhook and confirm stock is not decremented again.
- Cancel or expire a checkout session and confirm the order can be marked cancelled.

## Deployment

- Confirm Vercel deployment succeeds.
- Confirm required Vercel environment variables are configured.
- Confirm Google OAuth production redirect URI is configured.
- Confirm the production URL loads without authentication errors.
- Confirm Sentry receives a test error when a DSN is configured.
- Check the home page, catalog, builder, and cart at mobile, tablet, and desktop widths.
