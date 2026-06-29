'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useLogout } from '@/hooks/use-auth';
import { useProducts } from '@/hooks/use-product';
import { formatPrice } from '@/lib/format-price';
import {
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CurrencySwitcher } from '../currency-switcher';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_RESULT_LIMIT = 8;
const FALLBACK_PRODUCT_IMAGE =
  'https://www.puravidabracelets.com/cdn/shop/files/square-image_2_1.jpg?crop=center&height=400&v=1774219636&width=400';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount, cartItems, removeFromCart, updateQuantity, clearCart } =
    useCartContext();
  const {
    getWishlistCount,
    wishlistItems,
    removeFromWishlist,
    addToCart: addWishlistToCart,
  } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const { currency, convert } = useCurrency();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data: searchData, isLoading: isSearchLoading } = useProducts(
    {
      page: 1,
      limit: SEARCH_RESULT_LIMIT,
      search: debouncedSearch,
    },
    { enabled: debouncedSearch.length >= 2 }
  );

  const searchResults = debouncedSearch.length >= 2 ? (searchData?.products ?? []) : [];
  const searchTotal = debouncedSearch.length >= 2 ? (searchData?.total ?? 0) : 0;

  // NEW (UI-only): scroll-aware adaptive navbar — purely presentational state.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const closeSearch = () => {
    setSearchFocused(false);
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const goToShopSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    closeSearch();
    router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToShopSearch(searchQuery);
    }
  };

  useEffect(() => {
    setIsOpen(false);
    setIsCartDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const clickedCartButton =
      cartButtonRef.current && cartButtonRef.current.contains(target);
    const clickedCartPanel =
      (dropdownRef.current && dropdownRef.current.contains(target)) ||
      (mobileDropdownRef.current && mobileDropdownRef.current.contains(target));

    if (!clickedCartButton && !clickedCartPanel) {
      setIsCartDropdownOpen(false);
    }

    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(target) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(target)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NEW (UI-only): global Escape handling for overlays/dropdowns.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (searchFocused) closeSearch();
      if (isOpen) setIsOpen(false);
      if (isCartDropdownOpen) {
        setIsCartDropdownOpen(false);
        cartButtonRef.current?.focus();
      }
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
        userButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchFocused, isOpen, isCartDropdownOpen, isUserDropdownOpen]);

  // NEW (UI-only): ⌘K / Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchFocused(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // NEW (UI-only): lock body scroll while mobile drawer or search is open.
  useEffect(() => {
    const lock = isOpen || searchFocused;
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, searchFocused]);

  const getTotalPrice = () => {
    const total = cartItems.reduce((total, item) => {
      const price =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.price));
      return total + price * item.quantity;
    }, 0);
    return formatPrice(convert(total), currency);
  };

  const totalItems = cartCount + wishlistCount;

  const handleLogout = () => {
    logout.mutate();
  };

  const cartDropdownContent = (
    <>
      {/* Tabs */}
      <div className='mb-3 flex items-center gap-1 rounded-full bg-surface p-1'>
        <button
          onClick={() => setActiveTab('cart')}
          className={[
            'flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
            activeTab === 'cart'
              ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
              : 'text-foreground/60 hover:text-foreground',
          ].join(' ')}
        >
          Cart ({cartCount})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={[
            'flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
            activeTab === 'wishlist'
              ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
              : 'text-foreground/60 hover:text-foreground',
          ].join(' ')}
        >
          <Heart className='h-3 w-3' />
          Saved ({wishlistCount})
        </button>
      </div>

      {/* Cart Content */}
      {activeTab === 'cart' &&
        (cartItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className='h-6 w-6' />}
            title='Your cart is empty'
            subtitle='Browse the shop to add items'
          />
        ) : (
          <>
            <ul className='max-h-80 space-y-2 overflow-y-auto pr-1'>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className='group rounded-xl border border-border/50 bg-surface/60 p-3 transition-colors hover:bg-card-hover'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-foreground'>
                        {item.name}
                      </p>
                      <p className='mt-0.5 text-xs font-semibold text-brand'>
                        {formatPrice(
                          convert(
                            typeof item.price === 'number'
                              ? item.price
                              : parseFloat(String(item.price))
                          ),
                          currency
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className='rounded-md p-1 text-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive'
                      aria-label='Remove item'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </div>
                  <div className='mt-2 inline-flex items-center gap-1 rounded-full border border-border/60 bg-card p-0.5'>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className='grid h-6 w-6 place-items-center rounded-full transition-colors hover:bg-surface-2 disabled:opacity-40'
                      aria-label='Decrease quantity'
                    >
                      <Minus className='h-3 w-3' />
                    </button>
                    <span className='min-w-6 text-center text-xs font-semibold'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='grid h-6 w-6 place-items-center rounded-full transition-colors hover:bg-surface-2'
                      aria-label='Increase quantity'
                    >
                      <Plus className='h-3 w-3' />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className='mt-3 space-y-2 border-t border-border/60 pt-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-foreground/60'>Subtotal</span>
                <span className='font-semibold text-foreground'>
                  {getTotalPrice()}
                </span>
              </div>
              <Link
                href='/checkout'
                onClick={() => setIsCartDropdownOpen(false)}
                className='block'
              >
                <Button
                  className='w-full text-brand-foreground'
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  Checkout
                </Button>
              </Link>
              <Link href='/cart' className='block'>
                <Button variant='outline' className='w-full'>
                  View Cart
                </Button>
              </Link>
            </div>
          </>
        ))}

      {/* Wishlist Content */}
      {activeTab === 'wishlist' &&
        (wishlistItems.length === 0 ? (
          <EmptyState
            icon={<Heart className='h-6 w-6' />}
            title='No saved items'
            subtitle='Save your favorites for later'
          />
        ) : (
          <>
            <ul className='max-h-80 space-y-2 overflow-y-auto pr-1'>
              {wishlistItems.map((item) => (
                <li
                  key={item.id}
                  className='rounded-xl border border-border/50 bg-surface/60 p-3'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-foreground'>
                        {item.name}
                      </p>
                      <p className='mt-0.5 text-xs font-semibold text-brand'>
                        {formatPrice(
                          convert(
                            typeof item.price === 'number'
                              ? item.price
                              : parseFloat(String(item.price))
                          ),
                          currency
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className='rounded-md p-1 text-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive'
                      aria-label='Remove from wishlist'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      addWishlistToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className='mt-2 w-full rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-card-hover'
                  >
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href='/wishlist'
              onClick={() => setIsCartDropdownOpen(false)}
              className='mt-3 block text-center text-xs font-medium text-brand hover:underline'
            >
              View all {wishlistItems.length} wishlist items →
            </Link>
          </>
        ))}
    </>
  );

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  /* ────────────────────────────────────────────────────────────────────────
   *  UI — REDESIGNED
   * ──────────────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ambient glow behind the navbar — uses theme hero-glow */}
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,var(--hero-glow)_0%,transparent_70%)] opacity-20'
      />

      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand'
      >
        Skip to content
      </a>

      <header
        role='banner'
        className={[
          'fixed inset-x-0 top-0 z-50 w-full transition-all duration-300',
          'bg-card/80 backdrop-blur-xl backdrop-saturate-150',
          'border-b border-border/60',
          scrolled
            ? 'shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]'
            : 'shadow-none',
        ].join(' ')}
      >
        {/* hairline brand sheen */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 opacity-30'
          style={{ background: 'var(--gradient-card)' }}
        />

        <div
          className={[
            'relative mx-auto flex w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8',
            'transition-[height] duration-300',
            scrolled ? 'h-14' : 'h-16',
          ].join(' ')}
        >
          {/* ─── LEFT · Brand ─────────────────────────────────────────── */}
          <Link
            href='/'
            className='group relative z-10 flex shrink-0 items-center gap-2.5'
          >
            <span
              className='relative grid h-9 w-9 place-items-center rounded-2xl text-brand-foreground shadow-[0_6px_20px_-6px_var(--hero-glow)] transition-transform duration-300 group-hover:scale-105'
              style={{ background: 'var(--gradient-brand)' }}
            >
              <Image
                src={logo}
                alt='VendorEase'
                width={20}
                height={20}
                className='h-5 w-5 object-contain'
              />
              <span className='absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20' />
            </span>
            <span className='hidden font-mono text-base font-semibold tracking-tight text-foreground sm:inline'>
              VendorEase
            </span>
          </Link>

          {/* ─── CENTER · Segmented Nav (desktop) ─────────────────────── */}
          <nav className='relative z-10 mx-auto hidden lg:block'>
            <ul className='flex items-center gap-1 rounded-full border border-border/60 bg-surface/60 p-1 backdrop-blur'>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={[
                        'relative inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300',
                        active
                          ? 'text-foreground'
                          : 'text-foreground/60 hover:text-foreground',
                      ].join(' ')}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className='absolute inset-0 rounded-full bg-surface-2 shadow-sm ring-1 ring-border/60'
                        />
                      )}
                      <span className='relative'>{item.label}</span>
                      {active && (
                        <span
                          aria-hidden
                          className='absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full'
                          style={{ background: 'var(--gradient-brand)' }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ─── RIGHT · Utilities segment ────────────────────────────── */}
          <div className='relative z-10 ml-auto flex items-center gap-1.5'>
            {/* Search trigger (desktop) */}
            <button
              onClick={() => setSearchFocused(true)}
              className='hidden h-9 items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 text-sm text-foreground/60 transition-all hover:text-foreground hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card md:inline-flex'
              aria-label='Open search (Ctrl+K)'
              aria-haspopup='dialog'
              aria-expanded={searchFocused}
              aria-controls='global-search-dialog'
            >
              <Search className='h-4 w-4' aria-hidden='true' />
              <span className='hidden lg:inline'>Search products…</span>
              <kbd
                aria-hidden='true'
                className='hidden rounded-md border border-border/60 bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground/50 lg:inline'
              >
                ⌘K
              </kbd>
            </button>

            {/* Search trigger (mobile icon) */}
            <button
              onClick={() => setSearchFocused(true)}
              className='grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card md:hidden'
              aria-label='Open search'
              aria-haspopup='dialog'
              aria-expanded={searchFocused}
              aria-controls='global-search-dialog'
            >
              <Search className='h-4.5 w-4.5' aria-hidden='true' />
            </button>

            {/* hairline divider */}
            <span
              aria-hidden='true'
              className='hidden h-6 w-px bg-border/70 md:inline-block'
            />

            {/* Currency */}
            <div className='hidden sm:block'>
              <CurrencySwitcher />
            </div>

            {/* Cart */}
            <div className='relative'>
              <button
                ref={cartButtonRef}
                onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                className='group relative grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-all hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card'
                aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                aria-haspopup='menu'
                aria-expanded={isCartDropdownOpen}
                aria-controls='cart-dropdown'
              >
                <ShoppingCart
                  className='h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-y-0.5'
                  aria-hidden='true'
                />
                {totalItems > 0 && (
                  <span
                    aria-hidden='true'
                    className='absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-brand-foreground shadow-[0_2px_8px_-2px_var(--hero-glow)]'
                    style={{ background: 'var(--gradient-brand)' }}
                  >
                    {totalItems}
                    <span className='absolute inset-0 animate-ping rounded-full bg-brand/40' />
                  </span>
                )}
              </button>

              {/* Cart Dropdown — Desktop + Mobile */}
              {isCartDropdownOpen && (
                <>
                  <div
                    ref={mobileDropdownRef}
                    id='cart-dropdown-mobile'
                    role='dialog'
                    aria-label='Cart and wishlist'
                    className='fixed inset-x-4 top-16 z-50 block max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border/70 bg-card/95 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden'
                  >
                    {cartDropdownContent}
                  </div>

                  <div
                    ref={dropdownRef}
                    id='cart-dropdown'
                    role='dialog'
                    aria-label='Cart and wishlist'
                    className='hidden md:block absolute right-0 top-full z-50 mt-3 w-[380px] origin-top-right animate-in fade-in slide-in-from-top-2 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl'
                  >
                    {cartDropdownContent}
                  </div>
                </>
              )}
            </div>

            <span
              aria-hidden='true'
              className='hidden h-6 w-px bg-border/70 sm:inline-block'
            />

            {/* Auth */}
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className='grid h-9 w-9 place-items-center rounded-full text-brand-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card'
                  style={{ background: 'var(--gradient-brand)' }}
                  aria-label={`Account menu for ${user?.name || 'user'}`}
                  aria-haspopup='menu'
                  aria-expanded={isUserDropdownOpen}
                  aria-controls='user-dropdown'
                >
                  <span aria-hidden='true' className='text-xs font-bold'>
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div
                    ref={userDropdownRef}
                    id='user-dropdown'
                    role='menu'
                    aria-label='Account menu'
                    className='absolute right-0 top-full z-50 mt-3 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl'
                  >
                    <div
                      className='relative border-b border-border/60 p-4'
                      style={{ background: 'var(--gradient-card)' }}
                    >
                      <p className='text-[10px] uppercase tracking-wider text-foreground/50'>
                        Signed in as
                      </p>
                      <p className='mt-0.5 truncate text-sm font-semibold text-foreground'>
                        {user?.name || 'User'}
                      </p>
                      <p className='truncate text-xs text-foreground/60'>
                        {user?.email || ''}
                      </p>
                    </div>

                    <div className='p-1.5'>
                      <UserLink
                        href='/dashboard'
                        icon={<LayoutDashboard className='h-4 w-4' />}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Dashboard
                      </UserLink>
                      <UserLink
                        href='/dashboard/orders'
                        icon={<ShoppingBag className='h-4 w-4' />}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Orders
                      </UserLink>
                      <UserLink
                        href='/dashboard/settings'
                        icon={<Settings className='h-4 w-4' />}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Settings
                      </UserLink>
                      <UserLink
                        href='/dashboard/referrals'
                        icon={<Gift className='h-4 w-4' />}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Referrals
                      </UserLink>
                    </div>

                    <div className='border-t border-border/60 p-1.5'>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10'
                      >
                        <LogOut className='h-4 w-4' />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/login' className='hidden sm:block'>
                <Button
                  className='h-9 rounded-full px-4 text-sm text-brand-foreground'
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card lg:hidden'
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls='mobile-drawer'
            >
              {isOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Command-style search overlay ─────────────────────────────────── */}
      {searchFocused && (
        <div
          className='fixed inset-0 z-[60] animate-in fade-in'
          onClick={closeSearch}
          role='presentation'
        >
          <div
            aria-hidden='true'
            className='absolute inset-0 bg-foreground/40 backdrop-blur-sm'
          />
          <div
            id='global-search-dialog'
            role='dialog'
            aria-modal='true'
            aria-label='Search the catalog'
            className='relative mx-auto mt-24 w-[92%] max-w-2xl animate-in slide-in-from-top-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] backdrop-blur-xl'>
              <div className='flex items-center gap-3 border-b border-border/60 px-4 py-3'>
                <Search
                  className='h-4 w-4 text-foreground/50'
                  aria-hidden='true'
                />
                <label htmlFor='global-search-input' className='sr-only'>
                  Search products, brands, categories
                </label>
                <input
                  ref={searchInputRef}
                  id='global-search-input'
                  autoFocus
                  type='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder='Search products, brands, categories…'
                  className='flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none'
                />
                <kbd
                  aria-hidden='true'
                  className='rounded-md border border-border/60 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-foreground/50'
                >
                  esc
                </kbd>
              </div>

              <div className='max-h-[min(60vh,28rem)] overflow-y-auto'>
                {searchQuery.trim().length < 2 ? (
                  <div className='px-4 py-6 text-center text-xs text-foreground/50'>
                    <Sparkles
                      className='mx-auto mb-2 h-5 w-5 text-brand'
                      aria-hidden='true'
                    />
                    Type at least 2 characters to search the catalog
                  </div>
                ) : isSearchLoading ? (
                  <div className='space-y-1 p-2'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className='flex animate-pulse items-center gap-3 rounded-xl px-3 py-2.5'
                      >
                        <div className='h-12 w-12 shrink-0 rounded-lg bg-muted' />
                        <div className='flex-1 space-y-2'>
                          <div className='h-3 w-2/3 rounded bg-muted' />
                          <div className='h-2.5 w-1/3 rounded bg-muted' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className='px-4 py-8 text-center text-sm text-foreground/50'>
                    No products found for &ldquo;{debouncedSearch}&rdquo;
                  </div>
                ) : (
                  <>
                    <ul className='p-2' role='listbox' aria-label='Search results'>
                      {searchResults.map((product) => (
                        <li key={product._id}>
                          <Link
                            href={`/shop/${product.slug}`}
                            onClick={closeSearch}
                            className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2'
                            role='option'
                          >
                            <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface'>
                              <Image
                                src={
                                  product.images?.[0]?.url ??
                                  FALLBACK_PRODUCT_IMAGE
                                }
                                alt={product.name}
                                fill
                                sizes='48px'
                                className='object-cover'
                              />
                            </div>
                            <div className='min-w-0 flex-1 text-left'>
                              <p className='truncate text-sm font-medium text-foreground'>
                                {product.name}
                              </p>
                              <p className='truncate text-xs text-foreground/50'>
                                {product.category?.name ?? 'Product'}
                                {product.brand ? ` · ${product.brand}` : ''}
                              </p>
                            </div>
                            <span className='shrink-0 text-sm font-semibold text-foreground'>
                              {formatPrice(
                                convert(product.basePrice),
                                currency
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {searchTotal > searchResults.length ? (
                      <div className='border-t border-border/60 p-3'>
                        <button
                          type='button'
                          onClick={() => goToShopSearch(searchQuery)}
                          className='w-full rounded-xl px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-surface-2'
                        >
                          View all {searchTotal} results for &ldquo;
                          {debouncedSearch}&rdquo;
                        </button>
                      </div>
                    ) : (
                      <div className='border-t border-border/60 p-3'>
                        <button
                          type='button'
                          onClick={() => goToShopSearch(searchQuery)}
                          className='w-full rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-2 hover:text-foreground'
                        >
                          See results in shop →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile drawer ───────────────────────────────────────────────── */}
      {isOpen && (
        <div id='mobile-drawer' className='fixed inset-0 z-[55] lg:hidden'>
          <div
            aria-hidden='true'
            className='absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in'
            onClick={() => setIsOpen(false)}
          />
          <aside
            role='dialog'
            aria-modal='true'
            aria-label='Main menu'
            className='absolute inset-y-0 right-0 flex w-[88%] max-w-sm animate-in slide-in-from-right flex-col border-l border-border/60 bg-card shadow-[0_0_60px_-10px_rgba(0,0,0,0.4)]'
          >
            <div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
              <span className='font-mono text-base font-semibold'>Menu</span>

              <button
                onClick={() => setIsOpen(false)}
                className='grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2'
                aria-label='Close menu'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-5'>
              {isAuthenticated ? (
                <div
                  className='mb-5 flex items-center gap-3 rounded-2xl border border-border/60 p-4'
                  style={{ background: 'var(--gradient-card)' }}
                >
                  <span
                    className='grid h-11 w-11 place-items-center rounded-full text-brand-foreground'
                    style={{ background: 'var(--gradient-brand)' }}
                  >
                    <User className='h-5 w-5' />
                  </span>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold'>
                      {user?.name || 'User'}
                    </p>
                    <p className='truncate text-xs text-foreground/60'>
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='mb-5 rounded-2xl border border-border/60 bg-surface/60 p-4'>
                  <p className='text-sm font-semibold'>Welcome to VendorEase</p>
                  <p className='mt-0.5 text-xs text-foreground/60'>
                    Sign in for a personalized experience
                  </p>
                  <Link href='/login' onClick={() => setIsOpen(false)}>
                    <Button
                      className='mt-3 w-full text-brand-foreground'
                      style={{ background: 'var(--gradient-brand)' }}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              <p className='mb-2 px-2 text-[10px] uppercase tracking-wider text-foreground/40'>
                Browse
              </p>
              <nav className='space-y-1'>
                {NAV_ITEMS.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className={[
                        'flex animate-in fade-in slide-in-from-right-2 items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                        active
                          ? 'bg-surface-2 text-foreground ring-1 ring-border/60'
                          : 'text-foreground/70 hover:bg-surface hover:text-foreground',
                      ].join(' ')}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span
                          className='h-1.5 w-1.5 rounded-full'
                          style={{ background: 'var(--gradient-brand)' }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {isAuthenticated && (
                <>
                  <p className='mb-2 mt-6 px-2 text-[10px] uppercase tracking-wider text-foreground/40'>
                    Account
                  </p>
                  <nav className='space-y-1'>
                    <MobileItem
                      href='/dashboard'
                      icon={<LayoutDashboard className='h-4 w-4' />}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </MobileItem>
                    <MobileItem
                      href='/dashboard/orders'
                      icon={<ShoppingBag className='h-4 w-4' />}
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </MobileItem>
                    <MobileItem
                      href='/dashboard/settings'
                      icon={<Settings className='h-4 w-4' />}
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </MobileItem>
                    <MobileItem
                      href='/dashboard/referrals'
                      icon={<Gift className='h-4 w-4' />}
                      onClick={() => setIsOpen(false)}
                    >
                      Referrals
                    </MobileItem>
                  </nav>
                </>
              )}
            </div>

            <div className='space-y-2 border-t border-border/60 p-4'>
              <div className='flex items-center justify-between rounded-xl border border-border/60 bg-surface/60 px-3 py-2'>
                <span className='text-xs text-foreground/60'>Currency</span>
                <CurrencySwitcher />
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* spacer so page content sits below the fixed navbar */}
      <div aria-hidden className='h-10 sm:h-16' />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 *  Local presentational helpers (UI-only, no business logic)
 * ────────────────────────────────────────────────────────────────────────── */

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-10 text-center'>
      <span
        className='mb-3 grid h-12 w-12 place-items-center rounded-2xl text-brand'
        style={{ background: 'var(--gradient-card)' }}
      >
        {icon}
      </span>
      <p className='text-sm font-semibold text-foreground'>{title}</p>
      <p className='mt-1 text-xs text-foreground/50'>{subtitle}</p>
    </div>
  );
}

function UserLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-surface-2 hover:text-foreground'
    >
      <span className='text-foreground/50'>{icon}</span>
      {children}
    </Link>
  );
}

function MobileItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface hover:text-foreground'
    >
      <span className='text-foreground/50'>{icon}</span>
      {children}
    </Link>
  );
}
