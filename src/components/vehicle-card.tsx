import Image from 'next/image';
import Link from 'next/link';
import { Users, Fuel, GitBranch } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Vehicle } from '@/types';
import { StarRating } from '@/components/common/star-rating';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/60">
      <CardHeader className="p-0 relative">
        <Badge variant="secondary" className="absolute top-3 right-3 z-10 font-semibold">{vehicle.type}</Badge>
        <Link href={`/vehicle/${vehicle.id}`} className="block rounded-lg aspect-[4/3] w-full overflow-hidden">
          <Image
            src={`http://localhost:8080${vehicle.imagePath}`}
            alt={vehicle.name}
            width={400}
            height={300}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
            data-ai-hint={vehicle.name}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">
          <Link href={`/vehicle/${vehicle.id}`} className="hover:text-primary">{vehicle.name}</Link>
        </CardTitle>
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={vehicle.averageRating} />
          <span className="text-xs text-muted-foreground">({vehicle.averageRating.toFixed(1)})</span>
        </div>
        <div className="text-muted-foreground text-sm grid grid-cols-2 gap-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{vehicle.seatCount} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <GitBranch className="h-4 w-4 text-primary" />
            <span>{vehicle.gearType}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div>
          <span className="font-bold text-2xl text-primary">₹{vehicle.rentPerHour}</span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>
        <Button asChild>
          <Link href={`/vehicle/${vehicle.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
