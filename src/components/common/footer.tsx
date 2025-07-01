import Link from 'next/link';
import { Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg text-foreground">WheelsOnRent</span>
          </div>
          <nav className="flex space-x-6 text-sm">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
          <div className="mt-4 md:mt-0">
            <p className="text-xs">&copy; {new Date().getFullYear()} WheelsOnRent. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
