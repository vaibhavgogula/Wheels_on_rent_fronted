'use client';

import Link from 'next/link';
import { Car, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { role, isLoggedIn, isLoading, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse Vehicles' },
  ];

  const roleLinks = (() => {
    if (isLoading) return []; // Don't render role-specific links while loading
    switch (role) {
      case 'renter':
        return [{ href: '/bookings', label: 'My Bookings' }];
      case 'owner':
        return [{ href: '/owner/dashboard', label: 'Owner Dashboard' }, { href: '/owner/vehicles', label: 'My Vehicles' }, { href: '/owner/rentals', label: 'Rental History' }];
      case 'admin':
        return [{ href: '/admin/dashboard', label: 'Admin Dashboard' }];
      default:
        return [];
    }
  })();

  const allNavLinks = [...navLinks, ...roleLinks];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline inline-block text-lg">WheelsOnRent</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <Button variant="ghost" onClick={logout}>Log Out</Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="mt-8 flex flex-col items-center">
                <Link href="/" className="mb-8 flex items-center space-x-2">
                  <Car className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline inline-block text-lg">WheelsOnRent</span>
                </Link>
                <nav className="flex flex-col gap-4 text-center">
                  {allNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-2 py-1 text-lg hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-8 w-full">
                  {!isLoading && (
                    <>
                      {isLoggedIn ? (
                         <Button variant="ghost" onClick={logout}>Log Out</Button>
                      ) : (
                        <>
                          <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
                          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild><Link href="/register">Sign Up</Link></Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
