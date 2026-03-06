# Paystack Payment Integration (Frontend Guide)

## Overview

This guide explains how to connect your frontend to the backend Paystack payment flow. All business logic (cart, checkout, order, payment) is handled in the backend. The frontend only triggers endpoints and redirects the user to Paystack.

---

## Step-by-Step Flow

### 1. Cart & Checkout

- User adds products to cart.
- User proceeds to checkout and submits shipping info (and coupon if available).
- Backend creates an order with status `payment_pending`.

### 2. Payment Initialization

- User clicks "Pay Now" or similar.
- Frontend calls:
  - POST `/payment/initialize`
  - Requires authentication (token/cookie)
  - Optionally send `{ callbackUrl }` in body (defaults to backend config)
- Backend fetches the latest `payment_pending` order for the user.
- Backend calls Paystack and responds with:
  - Paystack payment link (`authorization_url`)
  - Reference
  - Order info

### 3. Redirect to Paystack

- Frontend redirects user to Paystack payment page using the link from backend.

### 4. Payment Completion & Callback

- After payment, Paystack redirects user to the callback URL (provided during initialization).
- You can use a dedicated payment success page (e.g., `/payment-success`).

### 5. Payment Verification

- On the callback page, frontend calls:
  - GET `/payment/verify?reference=PAYSTACK_REF`
  - Requires authentication
- Backend verifies payment with Paystack, updates order status, clears cart, sends confirmation.
- Frontend displays payment/order status to user.

### 6. (Optional) Webhook Handling

- For extra reliability, listen for Paystack webhooks in backend.
- Webhook can update order/payment status even if user closes browser.

---

## Example: Initialize Payment

```js
// POST /payment/initialize
const response = await fetch('/api/payment/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_TOKEN',
  },
  body: JSON.stringify({
    callbackUrl: 'https://yourdomain.com/payment-success',
  }),
});
const { paystack, order } = await response.json();
// Redirect to Paystack payment page
window.location.href = paystack.data.authorization_url;
```

## Example: Payment Callback & Verification

```js
// On /payment-success page
const reference = new URLSearchParams(window.location.search).get('reference');
if (reference) {
  const response = await fetch(`/api/payment/verify?reference=${reference}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer YOUR_TOKEN',
    },
  });
  const result = await response.json();
  // Show payment/order status to user
}
```

---

## Best Practices & Notes

- Always use backend to fetch cart/order and initialize payment.
- Do NOT send userId from frontend; backend uses session/auth.
- Use Paystack metadata for reconciliation (userId, orderId, shippingInfo).
- Handle payment callback and verification for order update.
- Optionally listen for Paystack webhook for extra reliability.
- Show clear feedback to user after payment (success/failure).
- Secure all endpoints with authentication.

---

## Troubleshooting

- If payment fails, call `/payment/verify` again or check backend logs.
- If order is not updated, check webhook or backend verification logic.
- Always validate reference and order status before showing success.

---

## Summary

Frontend only triggers backend endpoints and redirects user. Backend handles all cart, checkout, order, and payment logic. Use Paystack reference and metadata for tracking and reconciliation.
