import {
  LayoutDashboard,
  Layers,
  LayoutGrid,
  type LucideIcon,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  TreeDeciduous,
  Users,
  Wallet,
  Headphones,
} from 'lucide-react';

export type AdminNavSection = {
  label: string;
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { title: 'Products', href: '/admin/products', icon: Package },
      { title: 'Collections', href: '/admin/collections', icon: LayoutGrid },
      { title: 'Categories', href: '/admin/categories', icon: TreeDeciduous },
      { title: 'Subcategories', href: '/admin/subcategories', icon: Layers },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { title: 'Abandoned carts', href: '/admin/carts', icon: ShoppingCart },
      { title: 'Payments', href: '/admin/payments', icon: Wallet },
    ],
  },
  {
    label: 'Customers & support',
    items: [
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Support', href: '/admin/support', icon: Headphones },
    ],
  },
  {
    label: 'Shortcuts',
    items: [
      {
        title: 'View storefront',
        href: '/',
        icon: Store,
      },
    ],
  },
];
