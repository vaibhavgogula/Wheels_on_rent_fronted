import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/common/star-rating';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Weekend Adventurer',
    avatar: 'https://placehold.co/100x100.png',
    rating: 5,
    testimonial: 'Booking a Jeep for our mountain trip was seamless. The vehicle was in perfect condition, and the owner was incredibly helpful. Made our trip unforgettable!',
  },
  {
    name: 'Mike P.',
    role: 'City Commuter',
    avatar: 'https://placehold.co/100x100.png',
    rating: 5,
    testimonial: 'I needed a car for a week of business meetings. Found a great deal on a clean, reliable sedan. Way better than traditional rental companies.',
  },
  {
    name: 'Jessica T.',
    role: 'Bike Enthusiast',
    avatar: 'https://placehold.co/100x100.png',
    rating: 5,
    testimonial: 'Rented a fantastic motorcycle for a coastal ride. The process was easy, and the bike was a dream to ride. Highly recommend WheelsOnRent!',
  },
];


export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-card">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}
          data-ai-hint="road trip car"
        ></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Your Journey, Your Wheels
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto mb-8">
            Rent the perfect car or bike from a community of trusted local owners. Adventure awaits.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/browse">Browse Vehicles</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose WheelsOnRent?</h2>
            <p className="text-lg text-muted-foreground mt-2">The best way to rent a vehicle is right here.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">Endless Variety</h3>
              <p className="text-muted-foreground">From luxury sedans and rugged SUVs to nimble bikes, find the perfect vehicle for any occasion.</p>
            </div>
            <div className="text-center p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-muted-foreground">Rent with confidence from a community of verified local owners and renters.</p>
            </div>
            <div className="text-center p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">Simple & Secure</h3>
              <p className="text-muted-foreground">Easy online booking, secure payments, and a seamless rental experience from start to finish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">What Our Renters Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} className="mb-2" />
                  <p className="text-muted-foreground italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
