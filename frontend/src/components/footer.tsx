import { logo } from '@/assets';
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      label: 'Shop',
      links: [
        { name: 'Products', href: '/shop' },
        { name: 'New Arrivals', href: '/shop/new' },
        { name: 'Deals', href: '/deals' },
      ],
    },
    {
      label: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      label: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Returns', href: '/returns' },
      ],
    },
  ];

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className='relative border-t border-border bg-linear-to-b from-primary/45 to-accent/30'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* Newsletter Section */}
        <div className='mb-12 rounded-2xl bg-secondary/40 border border-border/50 p-8 backdrop-blur-sm'>
          <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                Stay in the loop
              </h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                Get updates on new products and exclusive offers.
              </p>
            </div>
            <div className='flex w-full gap-2 md:w-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
              <button className='rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95'>
                <Mail className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
          {/* Brand Section - Spans 4 cols */}
          <div className='md:col-span-4'>
            <div className='flex items-center gap-3'>
              <div className='relative h-8 w-8'>
                <Image src={logo} alt='Logo' fill className='object-contain' />
              </div>
              <span className='text-lg font-bold text-foreground'>
                VendorEase
              </span>
            </div>
            <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
              Curated shopping that respects your time. Quality over quantity.
            </p>
            {/* Social Icons */}
            <div className='mt-6 flex gap-3'>
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground'
                    aria-label={social.label}
                  >
                    <Icon className='h-4 w-4' />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Grid - Spans 8 cols */}
          <div className='grid grid-cols-3 gap-6 md:col-span-8'>
            {footerLinks.map((section) => (
              <div key={section.label}>
                <h4 className='text-sm font-semibold text-foreground'>
                  {section.label}
                </h4>
                <ul className='mt-4 space-y-2.5'>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='group inline-flex text-sm text-muted-foreground transition-colors hover:text-primary'
                      >
                        {link.name}
                        <ArrowRight className='ml-1 h-3 w-3 opacity-0 transition-all group-hover:opacity-100' />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className='my-8 h-px bg-gradient-to-r from-border via-border/50 to-border' />

        {/* Bottom Bar */}
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <p className='text-xs text-muted-foreground'>
            © {currentYear} VendorEase. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link
              href='/privacy'
              className='text-xs text-muted-foreground transition-colors hover:text-primary'
            >
              Privacy
            </Link>
            <Link
              href='/terms'
              className='text-xs text-muted-foreground transition-colors hover:text-primary'
            >
              Terms
            </Link>
            <Link
              href='/cookies'
              className='text-xs text-muted-foreground transition-colors hover:text-primary'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
