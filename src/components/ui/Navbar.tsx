
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Shirt,
  BarChart3,
  Settings,
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Archive,
  ShoppingBag,
  ChevronDown,
  Wand2,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainDesktopLinks: NavLinkItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/closet', label: 'Armario', icon: Shirt },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/statistics', label: 'Estadísticas', icon: BarChart3 },
];

const suggestionsDropdownItems: NavLinkItem[] = [
  { href: '/sugerenciaia', label: 'Sugerencias AI', icon: Wand2 },
  { href: '/looks', label: 'Mis Looks', icon: Sparkles },
];

const moreSettingsDropdownItems: NavLinkItem[] = [
  { href: '/configuracion', label: 'Configuración', icon: Settings },
  { href: '/archivo', label: 'Archivo', icon: Archive },
  { href: '/deseos', label: 'Lista Deseos', icon: ShoppingBag },
];

const allMobileNavLinks: NavLinkItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sugerenciaia', label: 'Sugerencias AI', icon: Wand2 },
  { href: '/closet', label: 'Armario', icon: Shirt },
  { href: '/looks', label: 'Mis Looks', icon: Sparkles },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/statistics', label: 'Estadísticas', icon: BarChart3 },
  { href: '/archivo', label: 'Archivo', icon: Archive },
  { href: '/deseos', label: 'Lista Deseos', icon: ShoppingBag },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];

const desktopItemClass = (active: boolean) =>
  cn(
    'h-9 px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
    active && 'bg-accent text-accent-foreground'
  );

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    return href !== '/' && pathname.startsWith(href);
  };

  const isDropdownActive = (itemHrefs: string[]) => {
    return itemHrefs.some(href => isLinkActive(href));
  };

  const renderDropdown = (label: string, TriggerIcon: React.ElementType, items: NavLinkItem[]) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={desktopItemClass(isDropdownActive(items.map(item => item.href)))}
        >
          <TriggerIcon className="hidden xl:block" />
          {label}
          <ChevronDown className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {items.map((item) => {
          const active = isLinkActive(item.href);
          return (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('gap-2', active && 'bg-accent text-accent-foreground')}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* px-4 matches the `container mx-auto px-4` used by every page's <main> */}
      <div className="container mx-auto px-4">
        <div className="flex h-nav items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="EstilosIA Home"
            className="flex flex-shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo className="h-8 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {mainDesktopLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Button key={link.label} variant="ghost" asChild className={desktopItemClass(active)}>
                  <Link href={link.href} aria-current={active ? 'page' : undefined}>
                    <link.icon className="hidden xl:block" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}

            {renderDropdown('Sugerencias', Wand2, suggestionsDropdownItems)}
            {renderDropdown('Más Ajustes', SlidersHorizontal, moreSettingsDropdownItems)}
          </div>

          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú principal">
                  <Menu className="!size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" aria-describedby={undefined} className="flex w-72 flex-col bg-background p-0 sm:w-80">
                {/* SheetContent renders its own close button (top-right) */}
                <SheetHeader className="flex-row items-center space-y-0 border-b border-border px-4 py-3">
                  <SheetTitle asChild>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label="EstilosIA Home">
                      <Logo className="h-7 w-auto" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-grow space-y-1 overflow-y-auto px-3 py-4">
                  {allMobileNavLinks.map((link) => {
                    const active = isLinkActive(link.href);
                    return (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                            active && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
