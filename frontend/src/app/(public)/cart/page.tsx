'use client';

import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/format-price';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useCartContext();

  const { currency, convert } = useCurrency();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.price));
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background">
        {/* ambient gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--brand) 35%, transparent), transparent 70%)',
          }}
        />

        <section className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Your bag
          </span>

          <div className="relative mb-8">
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-full blur-2xl opacity-60"
              style={{ background: 'var(--gradient-brand)' }}
            />
            <div className="relative grid h-24 w-24 place-items-center rounded-3xl border border-border/60 bg-card shadow-xl">
              <ShoppingBag className="h-10 w-10 text-brand" />
            </div>
          </div>

          <h1
            className="mb-4 text-4xl font-semibold tracking-tight sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your cart is{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-brand)' }}
            >
              empty
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground">
            Nothing here yet — browse our curated pieces and start building your
            edit.
          </p>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-95"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* header band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] opacity-70"
        style={{ background: 'var(--gradient-hero)' }}
      />

      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/shop"
              className="group mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Continue shopping
            </Link>
            <h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Shopping{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--gradient-brand)' }}
              >
                Cart
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in
              bag
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-sm transition hover:border-brand/40 hover:shadow-xl sm:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                  style={{ background: 'var(--gradient-brand)' }}
                />

                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                  {/* name + unit price */}
                  <div className="min-w-0">
                    <h3
                      className="truncate text-base font-medium tracking-tight sm:text-lg"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(convert(item.price), currency)}{' '}
                      <span className="text-muted-foreground/60">/ each</span>
                    </p>
                  </div>

                  {/* quantity stepper */}
                  <div className="col-span-2 flex items-center justify-between gap-4 border-t border-dashed border-border/60 pt-4 sm:col-span-1 sm:col-start-2 sm:border-none sm:pt-0">
                    <div className="inline-flex items-center rounded-full border border-border/70 bg-background p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3 sm:hidden">
                      <span
                        className="text-base font-semibold tabular-nums"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {formatPrice(
                          convert(
                            (typeof item.price === 'number'
                              ? item.price
                              : parseFloat(String(item.price))) * item.quantity
                          ),
                          currency
                        )}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="grid h-9 w-9 place-items-center rounded-full text-destructive transition hover:bg-destructive/10"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* line total + remove (desktop) */}
                  <div className="hidden items-center gap-4 sm:flex">
                    <span
                      className="text-lg font-semibold tabular-nums"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {formatPrice(
                        convert(
                          (typeof item.price === 'number'
                            ? item.price
                            : parseFloat(String(item.price))) * item.quantity
                        ),
                        currency
                      )}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="grid h-9 w-9 place-items-center rounded-full text-destructive transition hover:bg-destructive/10"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-xl sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-40"
                style={{ background: 'var(--gradient-brand)' }}
              />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <h2
                    className="text-2xl font-semibold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Order Summary
                  </h2>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                    {getTotalItems()}
                  </span>
                </div>

                <dl className="space-y-3 border-b border-dashed border-border/70 pb-5">
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium tabular-nums">
                      {formatPrice(convert(getTotalPrice()), currency)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-muted-foreground">Items</dt>
                    <dd className="font-medium tabular-nums">
                      {getTotalItems()}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-muted-foreground">Clear Cart</dt>
                    <dd>
                      <button
                        onClick={handleClearCart}
                        className="text-xs font-medium uppercase tracking-[0.18em] text-destructive transition hover:opacity-70"
                      >
                        Clear
                      </button>
                    </dd>
                  </div>
                </dl>

                <div className="flex items-baseline justify-between py-6">
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Total
                  </span>
                  <span
                    className="text-3xl font-semibold tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {formatPrice(convert(getTotalPrice()), currency)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="group flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-95"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  Proceed to Checkout
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/shop"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background px-6 py-3.5 text-sm font-medium text-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>

                <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
