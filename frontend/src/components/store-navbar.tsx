'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useLogout } from '@/hooks/use-auth';
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
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CurrencySwitcher } from './currency-switcher';

export function StoreNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setIsCartDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      cartButtonRef.current &&
      !cartButtonRef.current.contains(event.target as Node)
    ) {
      setIsCartDropdownOpen(false);
    }
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target as Node) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(event.target as Node)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Store Navbar
  return (
    <div>
      {/* Announcement Banner */}
      <div className='bg-accent text-accent-foreground py-2 px-4 text-center text-xs font-semibold tracking-wide'>
        ✨ Premium Shopping Experience • Fast Shipping on All Orders
      </div>

      <nav className='sticky top-0 z-50 bg-card border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* LEFT: Logo */}
            <Link href='/' className='flex items-center gap-2.5 flex-shrink-0'>
              <Image
                src={logo}
                alt='VendorEase Logo'
                width={32}
                height={24}
                priority
                className='object-contain'
              />
              <span className='font-bold text-primary text-sm hidden sm:inline'>
                VendorEase
              </span>
            </Link>

            {/* CENTER: Desktop Navigation - Hidden on mobile */}
            <div className='hidden lg:flex items-center gap-8'>
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors relative pb-1 ${
                    pathname ===
                    (item === 'Home' ? '/' : `/${item.toLowerCase()}`)
                      ? 'text-primary'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {item}
                  {pathname ===
                    (item === 'Home' ? '/' : `/${item.toLowerCase()}`) && (
                    <div className='absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full'></div>
                  )}
                </Link>
              ))}
            </div>

            {/* RIGHT: Utilities Zone */}
            <div className='flex items-center gap-2 md:gap-3'>
              {/* Search - Icon Only, Expands on Focus */}
              <div className='hidden md:flex items-center'>
                <div
                  className={`relative transition-all duration-300 ${searchFocused ? 'w-48' : 'w-10'}`}
                >
                  <Search
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 flex-shrink-0'
                    size={16}
                  />
                  <input
                    type='text'
                    placeholder='Search...'
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full bg-muted border border-transparent rounded-lg py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-border transition-all ${
                      searchFocused ? 'bg-background' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Cart */}
              <div className='relative' ref={dropdownRef}>
                <button
                  ref={cartButtonRef}
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                  className='relative p-2 text-foreground/60 hover:text-foreground transition-colors rounded-md hover:bg-muted'
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown - Desktop */}
                {isCartDropdownOpen && (
                  <div className='hidden md:block absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-40 overflow-hidden'>
                    {/* Tabs - Pill Style */}
                    <div className='px-4 py-3 border-b border-border flex gap-2 bg-muted/50'>
                      <button
                        onClick={() => setActiveTab('cart')}
                        className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                          activeTab === 'cart'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-foreground/70 hover:text-foreground hover:bg-background/80'
                        }`}
                      >
                        Cart ({cartCount})
                      </button>
                      <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                          activeTab === 'wishlist'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-background text-foreground/70 hover:text-foreground hover:bg-background/80'
                        }`}
                      >
                        <Heart size={12} />
                        Saved ({wishlistCount})
                      </button>
                    </div>

                    {/* Cart Content */}
                    {activeTab === 'cart' && (
                      <div className='flex flex-col h-80'>
                        {cartItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                            <ShoppingCart
                              size={36}
                              className='text-foreground/20 mb-3'
                            />
                            <p className='text-sm font-semibold text-foreground mb-1'>
                              Your cart is empty
                            </p>
                            <p className='text-xs text-foreground/50'>
                              Add items to get started
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-5 py-3 space-y-2'>
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex-1'>
                                      <h4 className='text-sm font-semibold text-foreground truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-sm mt-1'>
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
                                      className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                      aria-label='Remove item'
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <div className='flex items-center gap-2 bg-background rounded-lg w-fit p-1.5'>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                      className='p-1.5 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors'
                                      aria-label='Decrease quantity'
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className='text-xs font-semibold min-w-6 text-center'>
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      className='p-1.5 bg-foreground/5 hover:bg-foreground/10 rounded transition-colors'
                                      aria-label='Increase quantity'
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className='border-t border-border px-5 py-3 bg-muted/40 space-y-2'>
                              <div className='flex justify-between items-center'>
                                <span className='text-xs font-semibold text-foreground/70'>
                                  Subtotal
                                </span>
                                <span className='text-accent font-bold text-sm'>
                                  {getTotalPrice()}
                                </span>
                              </div>
                              <Link
                                href='/checkout'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg text-xs'>
                                  Checkout
                                </Button>
                              </Link>
                              <Link href='/cart' className='block'>
                                <Button className='w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 rounded-lg text-xs'>
                                  View Cart
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Wishlist Content */}
                    {activeTab === 'wishlist' && (
                      <div className='flex flex-col h-80'>
                        {wishlistItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                            <Heart
                              size={36}
                              className='text-foreground/20 mb-3'
                            />
                            <p className='text-sm font-semibold text-foreground mb-1'>
                              No saved items
                            </p>
                            <p className='text-xs text-foreground/50'>
                              Save your favorites
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-5 py-3 space-y-2'>
                              {wishlistItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex-1'>
                                      <h4 className='text-sm font-semibold text-foreground truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-sm mt-1'>
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
                                      onClick={() =>
                                        removeFromWishlist(item.id)
                                      }
                                      className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                      aria-label='Remove from wishlist'
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <Button
                                    size='sm'
                                    className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs'
                                    onClick={() => {
                                      addWishlistToCart(item);
                                      removeFromWishlist(item.id);
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ))}

                              <Link
                                href='/wishlist'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button className='cursor-pointer w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 rounded-lg text-xs'>
                                  You Have {wishlistItems.length} Items in
                                  Wishlist Click to View
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cart Modal - Mobile */}
                {isCartDropdownOpen && (
                  <>
                    <div
                      className='fixed inset-0 bg-black/50 z-40 md:hidden'
                      onClick={() => setIsCartDropdownOpen(false)}
                    />
                    <div className='fixed bottom-0 left-0 right-0 md:hidden bg-card rounded-t-2xl shadow-2xl z-50 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300'>
                      {/* Handle Bar & Close */}
                      <div className='flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card'>
                        <div className='flex-1'>
                          <div className='w-10 h-1 bg-foreground/20 rounded-full mx-auto'></div>
                        </div>
                        <button
                          onClick={() => setIsCartDropdownOpen(false)}
                          className='p-2 hover:bg-muted rounded-lg transition-colors'
                          aria-label='Close cart'
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Tabs - Pill Style */}
                      <div className='px-4 py-3 border-b border-border flex gap-2 bg-muted/50 flex-shrink-0'>
                        <button
                          onClick={() => setActiveTab('cart')}
                          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                            activeTab === 'cart'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-foreground/70 hover:text-foreground hover:bg-background/80'
                          }`}
                        >
                          Cart ({cartCount})
                        </button>
                        <button
                          onClick={() => setActiveTab('wishlist')}
                          className={`px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                            activeTab === 'wishlist'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-background text-foreground/70 hover:text-foreground hover:bg-background/80'
                          }`}
                        >
                          <Heart size={12} />
                          Saved ({wishlistCount})
                        </button>
                      </div>

                      {/* Content */}
                      <div className='flex-1 overflow-y-auto'>
                        {/* Cart Content */}
                        {activeTab === 'cart' && (
                          <div className='flex flex-col h-full'>
                            {cartItems.length === 0 ? (
                              <div className='flex-1 flex flex-col items-center justify-center p-6 text-center'>
                                <ShoppingCart
                                  size={40}
                                  className='text-foreground/20 mb-3'
                                />
                                <p className='text-sm font-semibold text-foreground mb-1'>
                                  Your cart is empty
                                </p>
                                <p className='text-xs text-foreground/50'>
                                  Add items to get started
                                </p>
                              </div>
                            ) : (
                              <div className='flex flex-col h-full'>
                                <div className='flex-1 overflow-y-auto px-4 py-3 space-y-2'>
                                  {cartItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                    >
                                      <div className='flex justify-between items-start mb-2'>
                                        <div className='flex-1'>
                                          <h4 className='text-sm font-semibold text-foreground truncate'>
                                            {item.name}
                                          </h4>
                                          <p className='text-accent font-bold text-sm mt-1'>
                                            {formatPrice(
                                              convert(
                                                typeof item.price === 'number'
                                                  ? item.price
                                                  : parseFloat(
                                                      String(item.price)
                                                    )
                                              ),
                                              currency
                                            )}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            removeFromCart(item.id)
                                          }
                                          className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                          aria-label='Remove item'
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      <div className='flex items-center gap-2 bg-background rounded-lg w-fit p-1.5'>
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              item.id,
                                              item.quantity - 1
                                            )
                                          }
                                          disabled={item.quantity <= 1}
                                          className='p-1.5 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors'
                                          aria-label='Decrease quantity'
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <span className='text-xs font-semibold min-w-6 text-center'>
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              item.id,
                                              item.quantity + 1
                                            )
                                          }
                                          className='p-1.5 bg-foreground/5 hover:bg-foreground/10 rounded transition-colors'
                                          aria-label='Increase quantity'
                                        >
                                          <Plus size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Footer */}
                                <div className='border-t border-border px-4 py-3 bg-muted/40 space-y-2 flex-shrink-0'>
                                  <div className='flex justify-between items-center'>
                                    <span className='text-xs font-semibold text-foreground/70'>
                                      Subtotal
                                    </span>
                                    <span className='text-accent font-bold text-sm'>
                                      {getTotalPrice()}
                                    </span>
                                  </div>
                                  <Link
                                    href='/checkout'
                                    onClick={() => setIsCartDropdownOpen(false)}
                                    className='block'
                                  >
                                    <Button className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg text-xs'>
                                      Checkout
                                    </Button>
                                  </Link>
                                  <Link href='/cart' className='block'>
                                    <Button className='w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 rounded-lg text-xs'>
                                      View Cart
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Wishlist Content */}
                        {activeTab === 'wishlist' && (
                          <div className='flex flex-col h-full'>
                            {wishlistItems.length === 0 ? (
                              <div className='flex-1 flex flex-col items-center justify-center p-6 text-center'>
                                <Heart
                                  size={40}
                                  className='text-foreground/20 mb-3'
                                />
                                <p className='text-sm font-semibold text-foreground mb-1'>
                                  No saved items yet
                                </p>
                                <p className='text-xs text-foreground/50'>
                                  Save items for later
                                </p>
                              </div>
                            ) : (
                              <div className='flex flex-col h-full'>
                                <div className='flex-1 overflow-y-auto px-4 py-3 space-y-2'>
                                  {wishlistItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                    >
                                      <div className='flex justify-between items-start mb-2'>
                                        <div className='flex-1'>
                                          <h4 className='text-sm font-semibold text-foreground truncate'>
                                            {item.name}
                                          </h4>
                                          <p className='text-accent font-bold text-sm mt-1'>
                                            {formatPrice(
                                              convert(
                                                typeof item.price === 'number'
                                                  ? item.price
                                                  : parseFloat(
                                                      String(item.price)
                                                    )
                                              ),
                                              currency
                                            )}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            removeFromWishlist(item.id)
                                          }
                                          className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                          aria-label='Remove from wishlist'
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      <Button
                                        onClick={() => {
                                          addWishlistToCart(item);
                                          removeFromWishlist(item.id);
                                        }}
                                        className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg text-xs'
                                      >
                                        <ShoppingCart size={14} />
                                        Add to Cart
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Auth & Mobile Menu */}
              <div className='flex items-center gap-1'>
                {isAuthenticated ? (
                  <div
                    className='relative hidden md:block'
                    ref={userDropdownRef}
                  >
                    <button
                      ref={userButtonRef}
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className='p-2 rounded-lg hover:bg-muted transition-colors'
                      aria-label='User menu'
                    >
                      <div className='w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center'>
                        <User size={16} className='text-primary' />
                      </div>
                    </button>

                    {/* User Dropdown */}
                    {isUserDropdownOpen && (
                      <div className='absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-0 z-50'>
                        {/* User Info Section */}
                        <div className='px-4 py-3 border-b border-border'>
                          <p className='text-xs font-semibold text-foreground/60'>
                            Signed in as
                          </p>
                          <p className='text-sm font-bold text-foreground mt-1'>
                            {user?.name || 'User'}
                          </p>
                          <p className='text-xs text-foreground/50 mt-1'>
                            {user?.email || ''}
                          </p>
                          <div className='mt-3'>
                            <CurrencySwitcher />
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className='py-2 space-y-1'>
                          <Link
                            href='/dashboard'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            href='/dashboard/orders'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <ShoppingBag size={16} />
                            Orders
                          </Link>
                          <Link
                            href='/dashboard/settings'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                          <Link
                            href='/dashboard/referrals'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <Gift size={16} />
                            Referrals
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className='border-t border-border pt-2 pb-2 px-2'>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                            }}
                            className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors'
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href='/login' className='hidden md:block'>
                    <Button
                      size='sm'
                      className='bg-primary hover:bg-primary/90 text-primary-foreground text-xs'
                    >
                      Sign In
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className='lg:hidden p-2 hover:bg-muted rounded-md transition-colors'
                  aria-label='Toggle menu'
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Slide-in Panel */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className='fixed inset-0 bg-black/50 z-40 lg:hidden'
              onClick={() => setIsOpen(false)}
            />
            {/* Panel - Full Screen */}
            <div className='fixed inset-0 top-16 bg-card shadow-xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300 lg:hidden'>
              {/* Close Button */}
              <div className='flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card'>
                <span className='text-sm font-semibold text-foreground'>
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className='p-2 hover:bg-muted rounded-lg transition-colors'
                  aria-label='Close menu'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className='flex-1 overflow-y-auto'>
                {/* User Info Section - Top */}
                {isAuthenticated ? (
                  <div className='px-4 py-4 border-b border-border bg-muted/50'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
                        <User size={20} className='text-primary' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-semibold text-foreground'>
                          {user?.name || 'User'}
                        </p>
                        <p className='text-xs text-foreground/60'>
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='px-4 py-4 border-b border-border bg-muted/50'>
                    <p className='text-sm font-semibold text-foreground mb-3'>
                      Welcome to VendorEase
                    </p>
                    <Link
                      href='/login'
                      onClick={() => setIsOpen(false)}
                      className='block'
                    >
                      <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold'>
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Primary Navigation */}
                <div className='px-4 py-4 space-y-2 border-b border-border'>
                  {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                    <Link
                      key={item}
                      href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className='flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                {/* User Section - Authenticated Only */}
                {isAuthenticated && (
                  <div className='px-4 py-4 space-y-2 border-b border-border'>
                    <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wide px-3 mb-2'>
                      Account
                    </p>
                    <Link
                      href='/dashboard'
                      onClick={() => setIsOpen(false)}
                      className='flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href='/dashboard/orders'
                      onClick={() => setIsOpen(false)}
                      className='flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                    >
                      <ShoppingBag size={16} />
                      Orders
                    </Link>
                    <Link
                      href='/dashboard/settings'
                      onClick={() => setIsOpen(false)}
                      className='flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer Actions - Sticky Bottom */}
              <div className='px-4 py-4 border-t border-border space-y-3 bg-card flex-shrink-0'>
                <div>
                  <CurrencySwitcher />
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className='flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
