"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from '@/components/common/star-rating';
import { Users, Fuel, GitBranch } from 'lucide-react';
import { useVehicle } from '@/hooks/useVehicle';
import Link from 'next/link';

// Mock similar vehicles - in a real app, this would come from the API

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  console.log('Vehicle ID from params:', id, typeof id); // Debug log
  
  const { vehicle, loading, error } = useVehicle(id);
  console.log('Vehicle:', vehicle);
  
  // Validate id before using it
  if (!id || id === 'undefined' || id === 'null') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Vehicle ID</h1>
          <p className="text-muted-foreground mb-4">The vehicle ID provided is invalid.</p>
          <Button asChild>
            <Link href="/browse">Browse Vehicles</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The vehicle you are looking for does not exist.'}</p>
          <Button asChild>
            <Link href="/browse">Browse Vehicles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column - Vehicle Details */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
               <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={`http://localhost:8080${vehicle.imagePath}`}
                  alt={vehicle.name}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h1 className="font-headline text-3xl md:text-4xl font-bold">{vehicle.name}</h1>
              <div className="flex items-center gap-4 my-4 text-muted-foreground">
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><span>{vehicle.seatCount} Seats</span></div>
                <div className="flex items-center gap-2"><Fuel className="h-5 w-5 text-primary" /><span>{vehicle.fuelType}</span></div>
                <div className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" /><span>{vehicle.gearType}</span></div>
              </div>
              <Separator className="my-6" />
              <h2 className="font-headline text-2xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground">{vehicle.description}</p>
            </CardContent>
          </Card>

           {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-semibold mb-4">Reviews ({vehicle.reviews.length})</h2>
            <div className="space-y-6">
                {vehicle.reviews.length > 0 ? (
                  vehicle.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 flex gap-4">
                        <Avatar>
                          <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-4 mb-1">
                            <p className="font-semibold">{review.username}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No reviews yet. Be the first to review this vehicle!
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-baseline">
                <div>
                    <span className="font-bold text-3xl text-primary">₹{vehicle.rentPerHour}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                </div>
                <div className="flex items-center gap-2">
                    <StarRating rating={vehicle.averageRating} />
                    <span className="text-sm text-muted-foreground">({vehicle.totalReviews} reviews)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <Button size="lg" className="w-full" asChild disabled={!vehicle.available}>
                    <Link href={`/book/${vehicle.id}`}>
                      {vehicle.status === "AVAILABLE" ? 'Reserve Now' : 'Not Available'}
                    </Link>
                </Button>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">You&apos;ll select your dates on the next page.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
       {/* Similar Vehicles Section */}
       {/* <div className="mt-16">
          <h2 className="font-headline text-3xl font-bold text-center mb-8">Similar Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarVehicles.map(v => (
                 <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
       </div> */}
    </div>
  );
}
