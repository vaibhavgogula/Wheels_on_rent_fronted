'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { addDays, differenceInCalendarDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useVehicle } from '@/hooks/useVehicle';

export default function BookVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { vehicle, loading, error } = useVehicle(id);
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 4),
  });

  const durationInDays = date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) + 1 : 0;
  const totalCost = vehicle && durationInDays > 0 ? durationInDays * (vehicle.rentPerHour * 24) : 0;

  const handleBooking = async () => {
    if (!vehicle || !date?.from || !date?.to) return;

    setIsSubmitting(true);
    
    try {
      // Get JWT token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }

      // Format dates for API
      const startTime = new Date(date.from);
      startTime.setHours(10, 0, 0, 0); // Set to 10:00 AM
      
      const endTime = new Date(date.to);
      endTime.setHours(14, 0, 0, 0); // Set to 2:00 PM

      const bookingData = {
        vehicleId: vehicle.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      console.log('Submitting booking:', bookingData);

      const response = await fetch('http://localhost:8080/rentals/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Booking successful:', result);

      toast({
        title: "Booking Successful!",
        description: `You have successfully booked the ${vehicle.name}. You will be redirected to your bookings page.`,
        duration: 5000,
      });

      setTimeout(() => {
        router.push('/bookings');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An error occurred while booking. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The vehicle you are looking for does not exist.'}</p>
          <Button asChild>
            <a href="/browse">Browse Vehicles</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-muted/20">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column - Vehicle Image & Details */}
        <div>
           <Card className="overflow-hidden shadow-lg">
                <div className="aspect-[4/3] w-full overflow-hidden">
                    <Image
                    src={`http://localhost:8080${vehicle.imagePath}`}
                    alt={vehicle.name}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                    />
                </div>
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">{vehicle.name}</CardTitle>
                    <CardDescription>Price per day: <span className="font-bold text-primary">₹{vehicle.rentPerHour * 24}</span></CardDescription>
                </CardHeader>
            </Card>
        </div>

        {/* Right Column - Booking Form & Summary */}
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Confirm Your Booking</CardTitle>
              <CardDescription>Select your rental dates and confirm the details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="text-sm font-medium mb-2">Select Rental Dates</p>
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                        disabled={{ before: today }}
                        className="rounded-md border p-0"
                    />
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold">Booking Summary</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price per day</span>
                        <span className="font-semibold">₹{vehicle.rentPerHour * 24}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Rental duration</span>
                        <span className="font-semibold">{durationInDays} {durationInDays === 1 ? 'day' : 'days'}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center text-xl">
                        <span className="font-semibold">Total Price</span>
                        <span className="font-bold text-primary">₹{totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button 
                   size="lg" 
                   className="w-full" 
                   onClick={handleBooking} 
                   disabled={!date?.from || !date?.to || durationInDays <= 0 || isSubmitting || !vehicle.available}
                 >
                    {isSubmitting ? 'Processing...' : 'Confirm & Book Now'}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
