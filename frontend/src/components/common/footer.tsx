'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  {
    label: 'Shop',
    links: [
      { name: 'All Products', href: '/' },
      { name: 'New Arrivals', href: '/' },
      { name: 'Best Sellers', href: '/' },
      { name: 'Deals', href: '/' },
    ],
  },
  {
    label: 'Company',
    links: [
      { name: 'About', href: '/' },
      { name: 'Careers', href: '/' },
      { name: 'Press', href: '/' },
      { name: 'Blog', href: '/' },
    ],
  },
  {
    label: 'Support',
    links: [
      { name: 'Help Center', href: '/' },
      { name: 'Shipping', href: '/' },
      { name: 'Returns', href: '/' },
      { name: 'Contact', href: '/' },
    ],
  },
];

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className='relative overflow-hidden text-foreground'
      style={{
        background: 'var(--brand)',
      }}
    >
      <div
        className='relative mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-8'
        style={{ color: '#ffffff' }}
      >
        {/* Newsletter */}
        <div className='grid gap-10 rounded-3xl border border-white/20 bg-white/10 p-8 md:grid-cols-2 md:p-12'>
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/80'>
              <Sparkles className='h-3 w-3' />
              Join 50,000+ shoppers
            </div>

            <h2 className='text-3xl font-semibold tracking-tight md:text-4xl text-white'>
              <span className='shimmer-text'>Stay in the loop.</span>
            </h2>

            <p className='mt-3 max-w-md text-sm text-white/80'>
              Early access to drops, members-only deals, and stories from the
              makers we love. No spam — unsubscribe anytime.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex flex-col items-stretch gap-3 self-center sm:flex-row'
          >
            <Input
              type='email'
              required
              placeholder='you@domain.com'
              className='h-12 flex-1'
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'var(--accent)',
                color: '#ffffff',
              }}
            />

            <Button
              type='submit'
              className='group h-12 gap-2 px-6 font-medium transition-transform hover:scale-[1.02]'
              style={{
                background: 'var(--accent)',
                color: '#000000',
              }}
            >
              Subscribe
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Button>
          </form>
        </div>

        {/* Main grid */}
        <div className='mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12'>
          {/* Brand */}
          <div className='lg:col-span-4'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg overflow-hidden bg-white/20'>
                {/* show logo if available */}
                <div className='relative h-6 w-6'>
                  <Image
                    src={logo}
                    alt='VendorEase'
                    fill
                    className='object-contain'
                  />
                </div>
              </div>

              <span className='text-xl font-semibold tracking-tight text-white'>
                VendorEase
              </span>
            </Link>

            <p className='mt-5 max-w-sm text-sm leading-relaxed text-white/70'>
              Curated shopping that respects your time. Quality over quantity,
              always.
            </p>

            <ul className='mt-6 space-y-3 text-sm text-white/70'>
              <li className='flex items-center gap-3'>
                <MapPin className='h-4 w-4 text-white/50' />
                221B Baker Street, London
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-white/50' />
                hello@vendorease.com
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-white/50' />
                +1 (555) 010-2024
              </li>
            </ul>

            <div className='mt-7 flex gap-2'>
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className='group flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/70 transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 hover:text-white'
                  >
                    <Icon className='h-4 w-4' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8'>
            {footerLinks.map((section) => (
              <div key={section.label}>
                <h3 className='text-xs font-semibold uppercase tracking-[0.18em] text-white/60'>
                  {section.label}
                </h3>

                <ul className='mt-5 space-y-3'>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white'
                      >
                        {link.name}
                        <ArrowRight className='h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100' />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className='mt-16 h-px w-full bg-white/20' />

        {/* Bottom bar */}
        <div className='mt-8 flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row'>
          <p>© {year} VendorEase. Crafted with care.</p>

          <div className='flex items-center gap-6'>
            <a href='#' className='transition-colors hover:text-white'>
              Privacy
            </a>
            <a href='#' className='transition-colors hover:text-white'>
              Terms
            </a>
            <a href='#' className='transition-colors hover:text-white'>
              Cookies
            </a>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden
          className='pointer-events-none select-none overflow-hidden mt-16'
        >
          <div
            className='-mb-6 text-center text-[20vw] font-bold leading-none tracking-tighter md:-mb-10'
            style={{ fontFamily: 'inherit', color: 'rgba(255, 255, 255, 0.1)' }}
          >
            VENDOREASE
          </div>
        </div>
      </div>
    </footer>
  );
}
